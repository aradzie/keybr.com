import { Layout } from "@keybr/keyboard";
import {
  Result,
  type Result as ResultType,
  TextType,
  useResults,
} from "@keybr/result";
import { parseFile } from "@keybr/result-io";
import { Histogram } from "@keybr/textinput";
import {
  Alert,
  Box,
  Button,
  Dialog,
  Field,
  FieldList,
  Icon,
  Para,
  toast,
} from "@keybr/widget";
import { mdiDeleteForever, mdiDownload, mdiFileUpload } from "@mdi/js";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";

export function FooterSection() {
  const { formatMessage } = useIntl();
  const {
    handleDownloadData,
    handleResetData,
    handleImportData,
    importDialog,
    handleMerge,
    handleReplace,
    handleConfirmReplace,
    closeImportDialog,
  } = useCommands();

  return (
    <>
      <FieldList>
        <Field>
          <Button
            size={16}
            icon={<Icon shape={mdiFileUpload} />}
            label={formatMessage({
              id: "t_Import_data",
              defaultMessage: "Import data",
            })}
            title={formatMessage({
              id: "profile.import.description",
              defaultMessage: "Import typing data from a JSON or .stats file.",
            })}
            onClick={() => {
              handleImportData();
            }}
          />
        </Field>
        <Field>
          <Button
            size={16}
            icon={<Icon shape={mdiDownload} />}
            label={formatMessage({
              id: "t_Download_data",
              defaultMessage: "Download data",
            })}
            title={formatMessage({
              id: "profile.download.description",
              defaultMessage: "Download all your typing data in JSON format.",
            })}
            onClick={() => {
              handleDownloadData();
            }}
          />
        </Field>
        <Field.Filler />
        <Field>
          <Button
            size={16}
            icon={<Icon shape={mdiDeleteForever} />}
            label={formatMessage({
              id: "t_Reset_statistics",
              defaultMessage: "Reset statistics",
            })}
            title={formatMessage({
              id: "profile.reset.description",
              defaultMessage:
                "Permanently delete all of your typing data and reset statistics.",
            })}
            onClick={() => {
              handleResetData();
            }}
          />
        </Field>
      </FieldList>
      <ImportDialog
        isOpen={importDialog != null}
        step={importDialog?.step ?? "merge_or_replace"}
        resultCount={importDialog?.importedResults?.length ?? 0}
        onMerge={handleMerge}
        onReplace={handleReplace}
        onConfirmReplace={handleConfirmReplace}
        onClose={closeImportDialog}
      />
    </>
  );
}

type JsonResult = {
  layout: string;
  textType: string;
  timeStamp: string; // ISO date string
  length: number;
  time: number;
  errors: number;
  speed: number;
  histogram: Array<{
    codePoint: number;
    hitCount: number;
    missCount: number;
    timeToType: number;
  }>;
};

function deserializeJsonResults(jsonData: JsonResult[]): Result[] {
  const results: Result[] = [];

  for (const data of jsonData) {
    // Find Layout by ID
    const layout = Layout.ALL.find(({ id }) => id === data.layout);
    if (!layout) {
      throw new Error(`Unknown layout: ${data.layout}`);
    }

    // Find TextType by ID
    const textType = TextType.ALL.find(({ id }) => id === data.textType);
    if (!textType) {
      throw new Error(`Unknown textType: ${data.textType}`);
    }

    // Parse timestamp
    const timeStamp = new Date(data.timeStamp).getTime();

    // Create Histogram
    const histogram = new Histogram(data.histogram);

    // Create Result
    const result = new Result(
      layout,
      textType,
      timeStamp,
      data.length,
      data.time,
      data.errors,
      histogram,
    );

    results.push(result);
  }

  return results;
}

function ImportDialog({
  isOpen,
  step,
  resultCount,
  onMerge,
  onReplace,
  onConfirmReplace,
  onClose,
}: {
  isOpen: boolean;
  step: "merge_or_replace" | "confirm_replace";
  resultCount: number;
  onMerge: () => void;
  onReplace: () => void;
  onConfirmReplace: () => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <Dialog onClose={onClose}>
      <Box direction="column">
        {step === "merge_or_replace" ? (
          <>
            <Para>
              Found {resultCount} results in the file. Choose how to proceed:
            </Para>
            <FieldList>
              <Field.Filler />
              <Field>
                <Button onClick={onMerge} label="Merge" />
              </Field>
              <Field>
                <Button onClick={onReplace} label="Replace" />
              </Field>
              <Field>
                <Button onClick={onClose} label="Cancel" />
              </Field>
              <Field.Filler />
            </FieldList>
          </>
        ) : (
          <>
            <Para>
              WARNING: This will DELETE all your existing typing data and
              replace it with the imported data. This operation cannot be
              undone! Are you absolutely sure you want to continue?
            </Para>
            <FieldList>
              <Field.Filler />
              <Field>
                <Button onClick={onConfirmReplace} label="Yes, Replace All" />
              </Field>
              <Field>
                <Button onClick={onClose} label="Cancel" />
              </Field>
              <Field.Filler />
            </FieldList>
          </>
        )}
      </Box>
    </Dialog>
  );
}

type ImportDialogState = {
  importedResults: ResultType[] | null;
  step: "merge_or_replace" | "confirm_replace";
};

function useCommands() {
  const { formatMessage } = useIntl();
  const { results, clearResults, appendResults, replaceAllResults } =
    useResults();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDialog, setImportDialog] = useState<ImportDialogState | null>(
    null,
  );

  const createResultKey = (result: ResultType): string => {
    return `${result.layout.id}-${result.textType.id}-${result.timeStamp}-${result.length}-${result.time}`;
  };

  const validateAllResults = (newResults: ResultType[]): boolean => {
    for (const result of newResults) {
      if (!result.validate()) {
        toast(
          <Alert severity="error">
            {formatMessage({
              id: "profile.import.validation_error",
              defaultMessage:
                "Some results in the file are invalid. Import aborted.",
            })}
          </Alert>,
        );
        return false;
      }
    }
    return true;
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.stats";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      try {
        const buffer = await file.arrayBuffer();
        let importedResults: ResultType[];

        // Detect file type and parse accordingly
        if (file.name.endsWith(".stats")) {
          // Binary .stats file
          importedResults = [...parseFile(new Uint8Array(buffer))];
        } else {
          // JSON file
          try {
            const jsonData = JSON.parse(new TextDecoder().decode(buffer));
            if (!Array.isArray(jsonData)) {
              throw new Error("Invalid JSON format");
            }
            importedResults = deserializeJsonResults(jsonData);
          } catch (err) {
            toast(
              <Alert severity="error">
                {formatMessage({
                  id: "profile.import.json_error",
                  defaultMessage:
                    "Failed to parse JSON file. Please check the file format.",
                })}
              </Alert>,
            );
            return;
          }
        }

        // Validate all results before importing
        if (!validateAllResults(importedResults)) {
          return;
        }

        // Create set of existing result keys for deduplication
        const existingKeys = new Set(results.map(createResultKey));

        // Debug logging
        console.log(
          "[Import Debug] File contains:",
          importedResults.length,
          "results",
        );
        console.log("[Import Debug] Existing results:", results.length);
        console.log("[Import Debug] Existing keys:", existingKeys.size);

        // Calculate total time in imported results
        const importedTime = importedResults.reduce(
          (sum, r) => sum + r.time,
          0,
        );
        console.log(
          "[Import Debug] Imported total time:",
          (importedTime / 3600000).toFixed(2),
          "hours",
        );

        // Show merge or replace dialog
        setImportDialog({
          importedResults,
          step: "merge_or_replace",
        });
      } catch (err) {
        toast(
          <Alert severity="error">
            {formatMessage({
              id: "profile.import.file_error",
              defaultMessage:
                "Failed to read file. Please ensure it is a valid export file.",
            })}
          </Alert>,
        );
      } finally {
        // Reset input
        target.value = "";
      }
    };
    input.click();
  };

  const handleMerge = () => {
    if (!importDialog?.importedResults) return;

    const importedResults = importDialog.importedResults;
    const existingKeys = new Set(results.map(createResultKey));

    // Merge: filter out duplicates
    const newResults = importedResults.filter(
      (result) => !existingKeys.has(createResultKey(result)),
    );

    console.log(
      "[Import Debug] Merge mode - New results:",
      newResults.length,
      "Filtered out:",
      importedResults.length - newResults.length,
    );

    if (newResults.length === 0) {
      toast(
        <Alert severity="info">
          {formatMessage({
            id: "profile.import.no_new",
            defaultMessage:
              "All results in the file are duplicates. Nothing was imported.",
          })}
        </Alert>,
      );
      setImportDialog(null);
      return;
    }

    appendResults(newResults);
    toast(
      <Alert severity="success">
        {formatMessage(
          {
            id: "profile.import.merge_success",
            defaultMessage:
              "Imported {count} new results (skipped {skipped} duplicates).",
          },
          {
            count: newResults.length,
            skipped: importedResults.length - newResults.length,
          },
        )}
      </Alert>,
    );
    setImportDialog(null);
  };

  const handleReplace = () => {
    // Show confirmation warning
    setImportDialog((prev) =>
      prev ? { ...prev, step: "confirm_replace" } : null,
    );
  };

  const handleConfirmReplace = () => {
    if (!importDialog?.importedResults) return;

    const importedResults = importDialog.importedResults;

    console.log(
      "[Import Debug] Replace mode - Importing all",
      importedResults.length,
      "results",
    );
    replaceAllResults(importedResults);
    toast(
      <Alert severity="success">
        {formatMessage(
          {
            id: "profile.import.replace_success",
            defaultMessage: "Replaced all data with {count} imported results.",
          },
          { count: importedResults.length },
        )}
      </Alert>,
    );
    setImportDialog(null);
  };

  return {
    handleDownloadData: () => {
      const json = JSON.stringify(results);
      const blob = new Blob([json], { type: "application/json" });
      download(blob, "typing-data.json");
    },
    handleResetData: () => {
      const message = formatMessage({
        id: "profile.reset.message",
        defaultMessage:
          "Are you sure you want to delete all data and reset your profile? " +
          "This operation is permanent and cannot be undone!",
      });
      if (window.confirm(message)) {
        clearResults();
      }
    },
    handleImportData,
    importDialog,
    handleMerge,
    handleReplace,
    handleConfirmReplace,
    closeImportDialog: () => setImportDialog(null),
  };
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", name);
  a.setAttribute("hidden", "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
