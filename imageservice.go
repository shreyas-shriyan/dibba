package main

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"runtime"
	"strings"
)

type ImageService struct{}

func (c *ImageService) PullImage(imageName string) (string, error) {
	cmd := exec.Command("container", "image", "pull", imageName, "--platform", "linux/"+runtime.GOARCH)
	data, err := cmd.CombinedOutput()
	return string(data), err
}

type Image struct {
	Size      string `json:"size"`
	Digest    string `json:"digest"`
	MediaType string `json:"mediaType"`
	Host      string `json:"host"`
	ImageName string `json:"imageName"`
	Tag       string `json:"tag"`
	Created   string `json:"created"`
}

type ImageV2 struct {
	Name         string `json:"name"`
	Tag          string `json:"tag"`
	ImageId      string `json:"imageId"`
	Architecture string `json:"architecture"`
	Size         string `json:"size"`
	Created      string `json:"created"`
}

func (c *ImageService) ListImagesV2() ([]ImageV2, error) {
	cmd := exec.Command("container", "image", "ls", "-v")
	data, err := cmd.CombinedOutput()
	if err != nil {
		return nil, err
	}

	lines := strings.Split(string(data), "\n")
	var images []ImageV2
	for i, line := range lines {
		if i == 0 || len(line) == 0 {
			continue
		}
		fields := strings.Fields(line)
		fmt.Println(fields, len(fields))
		sizeIndex := 5
		createdIndex := 7
		if len(fields) > 9 {
			sizeIndex = 6
			createdIndex = 8
		}
		images = append(images, ImageV2{
			Name:         fields[0],
			Tag:          fields[1],
			ImageId:      fields[2],
			Architecture: fields[4],
			Size:         fields[sizeIndex] + " " + fields[sizeIndex+1],
			Created:      fields[createdIndex],
		})
	}

	return images, nil
}

func (c *ImageService) ListImages() ([]Image, error) {
	cmd := exec.Command("container", "image", "ls", "--format", "json")
	data, err := cmd.CombinedOutput()
	if err != nil {
		return nil, err
	}

	// Unmarshal into the original nested shape then flatten
	type nestedImage struct {
		Descriptor struct {
			Size      int64  `json:"size"`
			Digest    string `json:"digest"`
			MediaType string `json:"mediaType"`
		} `json:"descriptor"`
		Reference string `json:"reference"`
	}

	var nested []nestedImage
	err = json.Unmarshal([]byte(data), &nested)
	if err != nil {
		return nil, err
	}

	images := make([]Image, 0, len(nested))

	for _, ni := range nested {

		split := strings.Split(ni.Reference, "/")

		imageName := strings.Split(split[len(split)-1], ":")[0]

		tag := ""
		if len(strings.Split(split[len(split)-1], ":")) > 1 {
			tag = strings.Split(split[len(split)-1], ":")[1]
		}

		host := strings.Join(split[:len(split)-1], "/")

		// Inspect the image to get the creation date
		inspectCmd := exec.Command("container", "image", "inspect", imageName)
		inspectData, err := inspectCmd.CombinedOutput()
		if err != nil {
			return nil, err
		}

		type inspectResult struct {
			Variants []struct {
				Config struct {
					Created      string `json:"created"`
					Architecture string `json:"architecture"`
				} `json:"config"`
				Size int64 `json:"size"`
			} `json:"variants"`
		}

		var inspectOut []inspectResult
		err = json.Unmarshal(inspectData, &inspectOut)
		if err != nil {
			return nil, err
		}

		// get the architecture of the device
		deviceArch := runtime.GOARCH

		var selectedImage struct {
			Config struct {
				Created      string `json:"created"`
				Architecture string `json:"architecture"`
			} `json:"config"`
			Size int64 `json:"size"`
		}

		for _, variant := range inspectOut[0].Variants {
			if variant.Config.Architecture == deviceArch {
				selectedImage = variant
			}
		}

		created := ""
		if len(inspectOut) > 0 && len(inspectOut[0].Variants) > 0 {
			created = selectedImage.Config.Created
		}

		size := ni.Descriptor.Size
		if len(inspectOut) > 0 {
			size = selectedImage.Size
		}

		images = append(images, Image{
			Size:      FormatBytes(uint64(size)),
			Digest:    ni.Descriptor.Digest,
			MediaType: ni.Descriptor.MediaType,
			Host:      host,
			ImageName: imageName,
			Tag:       tag,
			Created:   created,
		})
	}

	return images, nil
}
