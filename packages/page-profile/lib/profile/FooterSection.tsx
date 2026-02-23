import { Result, type Result as ResultType, useResults } from "@keybr/result";
import {
  Alert,
  Button,
  Dialog,
  Field,
  FieldList,
  Icon,
  Para,
  toast,
} from "@keybr/widget";
import { mdiDeleteForever, mdiDownload, mdiFileUpload } from "@mdi/js";
import { useState } from "react";
import { useIntl } from "react-intl";
import {
  ImportDialog,
  type ImportDialogState,
  useCommands,
} from "./import.tsx";

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
