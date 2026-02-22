import { Layout } from "@keybr/keyboard";
import {
  Result,
  type Result as ResultType,
  TextType,
  useResults,
} from "@keybr/result";
import { parseFile } from "@keybr/result-io";
import { Histogram } from "@keybr/textinput";
import { Alert, Button, Field, FieldList, Icon, toast } from "@keybr/widget";
import { mdiDeleteForever, mdiDownload, mdiFileUpload } from "@mdi/js";
import { useRef } from "react";
import { useIntl } from "react-intl";

export function FooterSection() {
  const { formatMessage } = useIntl();
  const { handleDownloadData, handleResetData, handleImportData } =
    useCommands();

  return (
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

function useCommands() {
  const { formatMessage } = useIntl();
  const { results, clearResults, appendResults } = useResults();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        // Ask user for merge or replace
        const mergeMessage = formatMessage(
          {
            id: "profile.import.merge_message",
            defaultMessage:
              "Found {count} results in the file. Click OK to merge with existing data (duplicates will be skipped). Click Cancel to replace all existing data.",
          },
          { count: importedResults.length },
        );

        const shouldMerge = window.confirm(mergeMessage);

        if (shouldMerge) {
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
        } else {
          // Replace: show second warning
          const replaceWarning = formatMessage({
            id: "profile.import.replace_warning",
            defaultMessage:
              "WARNING: This will DELETE all your existing typing data and replace it with the imported data. This operation cannot be undone! Are you absolutely sure you want to continue?",
          });

          if (window.confirm(replaceWarning)) {
            console.log(
              "[Import Debug] Replace mode - Importing all",
              importedResults.length,
              "results",
            );
            clearResults();
            appendResults(importedResults);
            toast(
              <Alert severity="success">
                {formatMessage(
                  {
                    id: "profile.import.replace_success",
                    defaultMessage:
                      "Replaced all data with {count} imported results.",
                  },
                  { count: importedResults.length },
                )}
              </Alert>,
            );
          }
        }
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
