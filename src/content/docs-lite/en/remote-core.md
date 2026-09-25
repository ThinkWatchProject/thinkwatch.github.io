# Connecting to a remote core

ThinkWatch Lite normally controls the core it starts on the same computer. It can instead connect to ThinkWatch Core running on a server, where `twcore` runs as a systemd service on Linux, and show that server's traffic, cost and configuration in the same pages. Clients anywhere on the network then send their requests to the server's gateway, and the app on a desktop computer shows and changes what the server does.

Installing and configuring the server is described in the [server deployment guide](https://github.com/ThinkWatchProject/ThinkWatch-Core/blob/main/docs/server.md) in the ThinkWatch Core repository. This page covers the app's side.

## What the server needs

- `twcore` installed and running, for example as the `twcore` systemd service that the install script sets up;
- the remote control port open, with the networks the app connects from in `listen.control.remote.allow_from`;
- the same core version as the app. When the versions differ, the app names both and shows the command to run on the server.

On a server installed with the script, the port is opened and the key shown with:

```sh
sudo -u thinkwatch THINKWATCH_HOME=/var/lib/thinkwatch twcore remote enable --allow 192.168.1.0/24
sudo -u thinkwatch THINKWATCH_HOME=/var/lib/thinkwatch twcore control-key
```

`twcore control-key` prints the key on its first line, followed by the control port, the server's addresses that listen on it and the allowed networks.

## Adding a connection

1. Open **Settings › Connection** and choose **Add remote connection**.
2. Enter a name for the connection and the server's **address**, a host name or an IP address.
3. Enter the **control port**, the value of `listen.control.remote.port` in the server's configuration, chosen at random between 20000 and 32000 when that section was written.
4. Enter the **key**, the 64 hexadecimal characters that `twcore control-key` printed.
5. Choose **Test connection**. The app completes the handshake and reports the server's core version and gateway address.
6. Choose **Save and switch** to connect now, or **Save** to switch later.

When the test fails, the app says why:

| Message | Meaning |
|---|---|
| Cannot connect to the address | The address or the port is wrong, a firewall blocks the port, or `listen.control.remote` is not enabled on the server |
| The server closed the connection | This computer's address is probably not in `listen.control.remote.allow_from` |
| The key is not correct | The key differs from the server's; `twcore control-key` on the server shows the current one |
| Version mismatch | The server runs a different core version; upgrade it with `twcore upgrade` on the server |

## Switching between connections

The app connects to one core at a time. The connection is switched from the menu at the foot of the sidebar, from **Settings › Connection**, or from the **Connection** submenu of the menu bar or tray menu. The app tests a remote connection before switching to it.

While the app is connected to a server, the core on this computer stops once its requests in progress have finished. Its configuration, keys and request history are kept, and switching back to this computer starts it again.

Clients on this computer that point to the local gateway would fail while it is stopped. When there are such clients, the switch offers to point them at the server's gateway instead; the Clients page offers the same afterwards.

**Connect at startup** chooses between the last used connection and this computer. Holding Option on macOS or Alt on Windows while the app opens shows the choice of connection first; on every platform, the choice also appears when the two previous startups did not finish. When the server cannot be reached, the app keeps retrying and shows the connection's state, with the option to switch to this computer; it does not switch back on its own.

## What changes while connected

- **Overview, Traffic, Keys, Upstreams, Routing and Security** show and change the configuration and history of the core on the server.
- **Clients and MCP** still act on the computer the app runs on: the Clients page points this computer's clients at the server's gateway, and the MCP page checks this computer's MCP servers, skills and hooks. A note at the top of each page says so. Clients on other machines are configured by hand with the server's gateway address and a gateway key.
- **Settings** is divided into the app on this computer (connection, general settings, about, uninstall) and the configuration on the server (listening, log retention). The remote control port and its key can be changed only on the server.
- **ChatGPT sign-in** uses a device code: a browser sign-in returns to the machine that runs core, which is the server.
- `${NAME}` in an upstream's key or headers reads the environment of the core process on the server, and the **system proxy** option means the server's system proxy.
- The **diagnostics bundle** is not available. The server refuses three things over a remote connection: producing the bundle, stopping core, and changing `listen.control`.
- If the connection drops, the pages keep showing the state at the moment of the disconnect and cannot be changed until the connection is restored. A system notification reports the disconnect, and the app reconnects on its own.

## Security of the connection

The control connection is encrypted and authenticated by a Noise handshake (`Noise_NNpsk0_25519_ChaChaPoly_BLAKE2s`) whose pre-shared key is `listen.control.key` in the server's `config.yaml`. There is no TLS and no certificate. A program that can reach the port but does not hold the key cannot control core.

The server accepts connections only from the networks in `listen.control.remote.allow_from`, and ignores a source for a minute after five failed handshakes within a minute. The gateway port carries requests in plain HTTP, so both ports should be reachable only from trusted networks; for access from outside, use a VPN or an SSH tunnel rather than exposing the ports.

The app stores the key in a file in its data directory that only the current user can read. Deleting a connection deletes its key and does not affect the server. After `twcore control-key --rotate` on the server, open the connection in **Settings › Connection** and replace the key.

## Next steps

- [Server deployment guide](https://github.com/ThinkWatchProject/ThinkWatch-Core/blob/main/docs/server.md): install, configure, start and upgrade `twcore` on a Linux server.
- [Architecture](/docs/lite/architecture): the control channel between the app and Core.
- [Overview](/docs/lite): what the app shows.
