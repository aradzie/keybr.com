import { useResults } from "@keybr/result";
import { Button, Field, FieldList, Icon } from "@keybr/widget";
import { mdiDeleteForever, mdiDownload } from "@mdi/js";
import { useIntl } from "react-intl";

export function FooterSection() {
  const { formatMessage } = useIntl();
  const { handleDownloadData, handleResetData } = useCommands();

  return (
    <FieldList>
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

function useCommands() {
  const { formatMessage } = useIntl();
  const { results, clearResults } = useResults();
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
