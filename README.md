# Mokk Interview

A simple interview simulator using ElevenLabs Conversational AI

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/<repo>.git
   cd your-repo
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create an `.env.local` file and add necessary environment variables:

   ```sh
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=<agent_id>
   ```

## Running the Project

### Development
```sh
pnpm dev
```
Runs the app in development mode at `http://localhost:3000`.

### Docker
```sh
docker compose up
```

### Production
```sh
pnpm build && pnpm start
```
Builds the app for production and starts the server.

## License
This project is licensed under the MIT License.
