import { Result, type Result as ResultType, useResults } from "@keybr/result";
import { parseFile } from "@keybr/result-io";
import {
  Alert,
  Button,
  Dialog,
  Field,
  FieldList,
  Para,
  toast,
} from "@keybr/widget";
import { useState } from "react";
import { useIntl } from "react-intl";
import { download } from "./FooterSection.tsx";
import {
  deserializeJsonResults,
  detectDuplicates,
  type JsonResult,
} from "./import.ts";

type ImportDialogState = {
  importedResults: ResultType[] | null;
  step: "merge_or_replace" | "confirm_replace";
};

function useCommands() {
  const { formatMessage } = useIntl();
  const { results, clearResults, appendResults, replaceAllResults } =
    useResults();

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
          importedResults = [...(await parseFile(new Uint8Array(buffer)))];
        } else {
          // JSON file
          try {
            const jsonData = JSON.parse(new TextDecoder().decode(buffer));
            if (!Array.isArray(jsonData)) {
              throw new Error("Invalid JSON format");
            }
            importedResults = deserializeJsonResults(jsonData as JsonResult[]);
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

  const [importDialog, setImportDialog] = useState<ImportDialogState | null>(
    null,
  );

  const handleMerge = () => {
    if (!importDialog?.importedResults) return;

    const importedResults = importDialog.importedResults;
    const existingKeys = new Set(results.map(createResultKey));

    // Merge: filter out duplicates
    const newResults = importedResults.filter(
      (result) => !existingKeys.has(createResultKey(result)),
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
      <Para>
        {step === "merge_or_replace" ? (
          <>Found {resultCount} results in the file. Choose how to proceed:</>
        ) : (
          <>
            WARNING: This will DELETE all your existing typing data and replace
            it with the imported data. This operation cannot be undone! Are you
            absolutely sure you want to continue?
          </>
        )}
      </Para>
      <FieldList>
        <Field.Filler />
        {step === "merge_or_replace" ? (
          <>
            <Field>
              <Button onClick={onMerge} label="Merge" />
            </Field>
            <Field>
              <Button onClick={onReplace} label="Replace" />
            </Field>
          </>
        ) : (
          <Field>
            <Button onClick={onConfirmReplace} label="Yes, Replace All" />
          </Field>
        )}
        <Field>
          <Button onClick={onClose} label="Cancel" />
        </Field>
        <Field.Filler />
      </FieldList>
    </Dialog>
  );
}

export type { ImportDialogState };
export { ImportDialog,useCommands };
