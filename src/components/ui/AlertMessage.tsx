import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface AlertMessageProps {
  alertMsgs: string[];
  showAlert: boolean;
  topSize?: string;
}

export function AlertMessage({
  alertMsgs,
  showAlert,
  topSize,
}: AlertMessageProps) {
  if (alertMsgs.length === 0 && !showAlert) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md transition-opacity duration-300 ${
        showAlert ? "opacity-100" : "opacity-0"
      }`}
      style={{
        zIndex: 99999,
        position: "absolute",
        top: topSize ?? "3rem",
      }}
    >
      <Alert
        variant="destructive"
        className="bg-white to-red-700 text-red-500 relative border border-red-500 shadow-lg"
      >
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {alertMsgs.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </AlertDescription>
      </Alert>
    </div>
  );
}
