import { Result, type Result as ResultType, useResults } from "@keybr/result";
import { parseFile } from "@keybr/result-io";
import {
  Alert,
  Button,
  Dialog,
  download,
  Field,
  FieldList,
  Para,
  toast,
} from "@keybr/widget";
import { useState } from "react";
import { useIntl } from "react-intl";
import {
  type DeserializeJsonResultOptions,
  deserializeJsonResults,
  type JsonResult,
  MAX_IMPORT_FILE_SIZE,
  MAX_IMPORT_RESULTS,
} from "./import-helpers.ts";

type ImportDialogState = {
  importedResults: ResultType[] | null;
  step: "merge_or_replace" | "confirm_replace";
};

function useCommands() {
  const { formatMessage } = useIntl();
  const { results, clearResults, appendResults, replaceAllResults } =
    useResults();

  // Create a unique key for each result to detect duplicates.
  // Includes timeStamp to allow the same typing session with different
  // timestamps to be treated as separate results (intentional behavior
  // for historical data import without deduplication conflicts).
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

      if (file.size > MAX_IMPORT_FILE_SIZE) {
        toast(
          <Alert severity="error">
            {formatMessage(
              {
                id: "profile.import.file_too_large",
                defaultMessage:
                  "File is too large. Maximum size is {maxSize}MB.",
              },
              { maxSize: Math.round(MAX_IMPORT_FILE_SIZE / (1024 * 1024)) },
            )}
          </Alert>,
        );
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        let importedResults: ResultType[];
        let skippedCount = 0;

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

            // Track skipped results for partial failures
            const options: DeserializeJsonResultOptions = {
              strict: false,
              onSkipped: (error, data) => {
                skippedCount++;
                console.warn(`Skipped invalid result: ${error.message}`, data);
              },
            };

            importedResults = deserializeJsonResults(
              jsonData as JsonResult[],
              options,
            );
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

        // Show info message for skipped results
        if (skippedCount > 0) {
          toast(
            <Alert severity="info">
              {formatMessage(
                {
                  id: "profile.import.partial_failure",
                  defaultMessage:
                    "Skipped {skipped} invalid results. Imported {count} valid results.",
                },
                { skipped: skippedCount, count: importedResults.length },
              )}
            </Alert>,
          );
        }

        if (importedResults.length === 0) {
          toast(
            <Alert severity="error">
              {formatMessage({
                id: "profile.import.no_valid_results",
                defaultMessage:
                  "No valid results found in the file. Import aborted.",
              })}
            </Alert>,
          );
          return;
        }

        if (importedResults.length > MAX_IMPORT_RESULTS) {
          toast(
            <Alert severity="error">
              {formatMessage(
                {
                  id: "profile.import.too_many_results",
                  defaultMessage:
                    "File contains too many results. Maximum is {maxResults}.",
                },
                { maxResults: MAX_IMPORT_RESULTS },
              )}
            </Alert>,
          );
          return;
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
  const { formatMessage } = useIntl();
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
              <Button
                onClick={onMerge}
                label={formatMessage({
                  id: "profile.import.merge",
                  defaultMessage: "Merge",
                })}
              />
            </Field>
            <Field>
              <Button
                onClick={onReplace}
                label={formatMessage({
                  id: "profile.import.replace",
                  defaultMessage: "Replace",
                })}
              />
            </Field>
          </>
        ) : (
          <Field>
            <Button
              onClick={onConfirmReplace}
              label={formatMessage({
                id: "profile.import.confirm_replace",
                defaultMessage: "Yes, Replace All",
              })}
            />
          </Field>
        )}
        <Field>
          <Button
            onClick={onClose}
            label={formatMessage({
              id: "profile.import.cancel",
              defaultMessage: "Cancel",
            })}
          />
        </Field>
        <Field.Filler />
      </FieldList>
    </Dialog>
  );
}

export type { ImportDialogState };
export { ImportDialog, useCommands };
