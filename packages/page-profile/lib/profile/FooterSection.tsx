import { useResults } from "@keybr/result";
import { Button, Field, FieldList, Icon, styleWidthWide } from "@keybr/widget";
import { mdiDeleteForever, mdiDownload } from "@mdi/js";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function FooterSection(): ReactNode {
  const { formatMessage } = useIntl();
  const { handleDownloadData, handleResetData } = useCommands();

  return (
    <FieldList>
      <Field>
        <Button
          onClick={() => {
            handleDownloadData();
          }}
          className={styleWidthWide}
          icon={<Icon shape={mdiDownload} />}
          label={formatMessage({
            id: "profile.control.downloadData.label",
            description: "Widget name.",
            defaultMessage: "Download Data",
          })}
          title={formatMessage({
            id: "profile.control.downloadData.description",
            description: "Widget description.",
            defaultMessage: "Download all your typing data in JSON format.",
          })}
        />
      </Field>
      <Field.Filler />
      <Field>
        <Button
          onClick={() => {
            handleResetData();
          }}
          className={styleWidthWide}
          icon={<Icon shape={mdiDeleteForever} />}
          label={formatMessage({
            id: "profile.control.resetData.label",
            description: "Widget name.",
            defaultMessage: "Reset Statistics",
          })}
          title={formatMessage({
            id: "profile.control.resetData.description",
            description: "Widget description.",
            defaultMessage:
              "Permanently delete all of your typing data and reset statistics.",
          })}
        />
      </Field>
    </FieldList>
  );
}

function useCommands() {
  const { formatMessage } = useIntl();
  const { results, clearResults } = useResults();
  return {
    handleDownloadData: (): void => {
      const json = JSON.stringify(results);
      const blob = new Blob([json], { type: "application/json" });
      download(blob, "typing-data.json");
    },
    handleResetData: (): void => {
      const message = formatMessage({
        id: "profile.control.resetData.message",
        description: "Confirmation text.",
        defaultMessage:
          "Are you sure you want to delete all data and reset your profile? " +
          "This operation is permanent and cannot be undone!",
      });
      if (window.confirm(message)) {
        clearResults();
      }
    },
  };
}

function download(blob: Blob, name: string): void {
  const a = document.createElement("a");
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", name);
  a.setAttribute("hidden", "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
