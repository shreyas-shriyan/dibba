package main

import (
	"errors"
	"fmt"
	"os/exec"
)

type ContainerService struct{}

func (c *ContainerService) CheckContainerServiceRunning() bool {
	cmd := exec.Command("container", "system", "status")
	_, err := cmd.Output()

	return err == nil
}

func (c *ContainerService) StartContainerService() error {
	cmd := exec.Command("container", "system", "start")
	_, err := cmd.Output()
	if err != nil {
		fmt.Println("Failed to start container")
		return err
	}

	return nil
}

func (c *ContainerService) StopContainerService() error {
	cmd := exec.Command("container", "system", "stop")
	_, err := cmd.Output()
	if err != nil {
		fmt.Println("Failed to stop container")
		return errors.New("Failed to stop container")
	}
	return nil
}
