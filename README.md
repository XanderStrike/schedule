# Schedule Builder

This project is a web-based tool for building employee schedules based on their availabilities and predefined shifts. It allows users to add employees and shifts, generate a schedule, and download or upload backups of the data.

Aided by Aider.

## Features

- Add and manage employee availabilities.
- Add and manage shifts.
- Generate a schedule based on availabilities and shifts.
- Download and upload backup JSON files of the schedule data.

## Docker Usage

To run the application using Docker, you can pull the pre-built image from Docker Hub and run it as follows:

1. Pull the Docker image:
   ```bash
   docker pull xanderstrike/schedule:latest
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8080:80 xanderstrike/schedule:latest
   ```

3. Open your web browser and navigate to `http://localhost:8080` to use the application.

## Usage

- Use the "Add Employee" form to input employee availability.
- Use the "Add Shift" form to define shifts.
- Click "Download Backup" to save the current schedule data as a JSON file.
- Use the "Upload Backup" button to restore schedule data from a JSON file.

## License

This project is licensed under the MIT License.
