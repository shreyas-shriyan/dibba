import { signal, effect } from "@preact/signals";
import { ContainerService } from "./bindings/github.com/shreyas-shriyan/dibba";
import { Events } from "@wailsio/runtime";

const isContainerRunning = signal(false);

Events.On("containerStatus", (value) => {
  isContainerRunning.value = value.data[0];
});

export function App() {
  // check container service status
  effect(() => {
    (async () => {
      const isRunning = await ContainerService.CheckContainerServiceRunning();
      isContainerRunning.value = isRunning;
    })();
  });

  return (
    <div class="container text-center mx-auto max-w-4xl p-4 pt-2">
      <h1 class="text-2xl font-bold text-success">Dibba</h1>
      <div class="alert alert-info mb-4 mt-2 flex justify-between">
        <span>
          Container service status:{" "}
          <span id="containerStatusText">
            {isContainerRunning.value ? "Running" : "Not Running"}
          </span>
        </span>
        <div class="flex gap-2">
          {isContainerRunning.value ? (
            <button
              className="btn btn-error"
              onClick={() =>
                ContainerService.StopContainerService()
                  .then(() => (isContainerRunning.value = false))
                  .catch((err) => {
                    console.log(err);
                  })
              }
            >
              Stop
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() =>
                ContainerService.StartContainerService()
                  .then(() => {
                    isContainerRunning.value = true;
                  })
                  .catch((err) => {
                    console.log("ssssss", err);
                  })
              }
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
