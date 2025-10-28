import {
  CheckContainerServiceRunning,
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

  const handleRestart = async () => {
    try {
      await StartContainerService();
      isContainerRunning.value = true;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div class="flex items-center gap-2">
      <div
        class={`w-3 h-3 rounded-full ${
          isContainerRunning.value ? "bg-success" : "bg-red-500"
        }`}
      ></div>
      <span class="text-sm text-gray-600">
        Service: {isContainerRunning.value ? "Running" : "Stopped"}
      </span>
      {!isContainerRunning.value && (
        <svg
          class="humbleicons hi-restart text-success cursor-pointer transition-colors"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          onClick={handleRestart}
          title="Restart Service"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="M4 4v5h5M5.07 8a8 8 0 1 1-.818 6"
          />
        </svg>
      )}
    </div>
  );
};

export default ContainerStatus;
