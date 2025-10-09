import {
  CheckContainerServiceRunning,
  StopContainerService,
  StartContainerService,
} from "../bindings/github.com/shreyas-shriyan/dibba/containerservice";
import { effect, signal } from "@preact/signals";
import { Events } from "@wailsio/runtime";

const isContainerRunning = signal(false);

Events.On("containerStatus", (value) => {
  isContainerRunning.value = value.data[0];
});

const ContainerStatus = () => {
  // check container service status
  effect(() => {
    (async () => {
      const isRunning = await CheckContainerServiceRunning();
      isContainerRunning.value = isRunning;
    })();
  });

  const handleContainerAction = async (shouldRun: boolean) => {
    try {
      if (shouldRun) {
        await StartContainerService();
        isContainerRunning.value = true;
      } else {
        await StopContainerService();
        isContainerRunning.value = false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
            onClick={() => handleContainerAction(false)}
          >
            Stop
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => handleContainerAction(true)}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default ContainerStatus;
