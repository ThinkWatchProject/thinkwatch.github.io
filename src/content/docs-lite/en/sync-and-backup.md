# Sync and backup

After moving to a new computer or reinstalling, the ThinkWatch Lite configuration can be imported whole from one file instead of being entered again item by item. Several computers and cores on servers can also share one configuration through a sync location of their own choosing: an upstream added or a key rotated on one device reaches the others. Every change to the configuration leaves a version that can be restored.

> What this page describes needs ThinkWatch Lite 2026.10.25 or later. With a remote core, the server needs core 0.78.0 or later.

This page covers config packs, backups, exporting and importing, turning on sync and setting up each kind of sync location, encryption, conflicts, restoring, and what is never exported or synced. Sharing a single upstream is described in [Import links](/docs/lite/import-links#generated-by-lite).

It is gathered in **Settings › Sync and backup**, which has a **Sync** part and a **Backups** part. While the app is connected to a remote core, the section sits under the server's configuration and manages the configuration on the server; see [With a remote core](#with-a-remote-core).

## Config packs

A config pack is a single file with the `.twconfig` extension that holds the configuration, the plugin scripts and Lite's general preferences. Exports, shares, the backup versions on the device and the versions in a sync location all use it.

- An unencrypted pack is a ZIP file. A pack encrypted with a passphrase is in the age format, with the key derived from the passphrase by scrypt, and decrypts to the same ZIP file. Both have the same extension and are told apart by their header.
- A pack is at most 16 MiB and may hold only the expected kinds of file; any other path, an absolute path or `..` rejects the whole pack. A plugin file whose SHA-256 does not match the configuration's record of it is marked as an error.
- A pack exported by a newer version asks for an update first, with a message that names its Core version and format and ends “Update ThinkWatch Lite first.” A pack from an older version is repaired as it is imported: fields this version does not know are removed and invalid values go back to their defaults, and the preview lists each repair.
- A wrong passphrase is reported as “The passphrase is not correct.”

## Backups

Backups are earlier versions of the configuration, kept in two places:

| Where | When a version is made | Kept |
|---|---|---|
| This device | On every change to the configuration: in the app, from the command line, by editing the file by hand, by sync, import, restore or one-click repair. Not when the content equals the previous version, and not when a ChatGPT token is renewed. | The last 10 versions |
| Sync location | The versions each device uploads once sync is on | The latest and the previous version |

A version on the device is a complete config pack, with the plugins, the sign-in tokens of ChatGPT and OAuth upstreams, and the local settings (the control channel key masked), stored in `history/` in the data directory. The folder and files can be read only by their owner and are not encrypted, the same protection `config.yaml` itself has. These versions replace the former version history, and **Backups** in the config file editor opens the same list. The old history files are removed when the first backup is kept after the upgrade.

The **Backups** part lists the versions newest first: the time, the source (such as **Edited in the app**, **Import**, **File edited by hand** or **Synced from MacBook Air**), where it is stored (**Local**, **Sync location**), what it holds (such as “7 upstreams, 2 plugins”) and the Core version that made it; the version in use is marked **Current**. A version stored both on the device and in the sync location is one row with both places marked. Every other version has **Restore…**, described under [Restore](#restore), and **Save as…**, which saves it as a config pack, optionally encrypted with a passphrase.

ThinkWatch Lite makes no scheduled backups and has no separate manual backup. To keep a copy elsewhere, use **Export config…** or **Save as…** on a version; the file can be stored anywhere.

## Exporting

There are three ways to export:

- **Export config…** in the **Backups** part, which exports the entire config by default;
- **Export N selected upstreams…** on the toolbar of the Upstreams page, once upstreams are selected;
- **Export as config pack…** in the share dialog of an upstream.

All three open the same export dialog. From the Upstreams page, the scope starts as **Selected items** with those upstreams checked.

| Item | Description |
|---|---|
| Scope | **Entire config** or **Selected items**. Selected items lists the upstreams, proxies, gateway keys, aliases, groups, routes, price sheets, security rules, plugins and global settings by category. Items that the selected ones refer to are checked automatically and marked **Included**, such as the upstream of a route or the proxy of an upstream. |
| Include keys | On by default. Covers upstream keys, header values, AWS credentials, OAuth client secrets, proxy passwords, gateway keys and the keys obtained by signing in to a Z.ai / BigModel account. Values written as `${NAME}` are exported as written, not expanded. |
| Encryption | **Encrypt the file with a passphrase**, off by default. When on, the passphrase is entered twice and has at least 8 characters. It is not stored, and importing asks for the same passphrase. |
| Not exported | What this export leaves out, such as “ChatGPT account and OAuth sign-ins (1 upstream); sign in or fill them in again after importing.”, “Listening, remote control and sync settings.” and “Request history.” With **Include keys** off, the upstream keys, gateway keys and proxy passwords are listed as well. |

With keys included and no encryption, the foot of the dialog warns: “The file contains keys in plain text. Keep it safe.”

## Importing

There are three ways to import:

- **Import config…** in the **Backups** part;
- dropping a config pack onto the main window;
- on a new installation, whose configuration is still the initial one, **Import config…** next to **New upstream** on the empty Upstreams page.

An encrypted pack first asks for its passphrase. The dialog then states what the pack is (whole or partial, with or without keys, when it was exported and by which Core version) and lists each of its items by category with a status:

| Status | When | What happens |
|---|---|---|
| New | Nothing of that name exists | Imported; uncheck it to skip it |
| Same | The same name with the same content | Nothing; counted in the summary |
| Conflict | The same name with different content | **Overwrite**, **Rename** or **Skip** must be chosen; there is no default |
| Conflict (global settings) | That section was changed on this device and differs from the pack | **Overwrite** or **Skip** must be chosen |
| Key missing | The pack holds no keys and nothing of that name here has the same destination (see below); or the upstream uses an OAuth refresh token and no upstream of that name here uses the same token endpoint | Imported disabled, with a **Key missing** tag on the upstream row; it can be enabled once the key, or for an OAuth upstream the refresh token, is filled in |
| Sign-in required | A ChatGPT upstream whose namesake here is not a ChatGPT account | Imported disabled, with **Sign in…** on the upstream row |
| Plugin | A plugin script | Imported disabled; a plugin that may change tool calls is approved when it is turned on |
| Error | It refers to an AWS profile, proxy or upstream that does not exist here; a field is invalid, such as an upstream address with a backslash or with a user name and password before the host; or a gateway key has the value of another existing key | Cannot be imported, with the reason |

**Import** stays unavailable until every conflict has a choice. **Overwrite all**, **Rename all** and **Skip all** above the list settle every conflict at once.

An import follows these rules:

- Upstreams, proxies, gateway keys, aliases, groups, routes, price sheets, custom security rules and plugins are added one by one, by name. Items in the current configuration that the pack does not have stay as they are; an import never deletes anything. Replacing the whole configuration with another is a restore; see [Restore](#restore).
- Each section of the global settings (failover, the state of each protection, the default route, the default key, auxiliary requests and the price sheet settings) is one item. When the section on this device is still at its defaults, the imported value is taken; otherwise a different imported value is a conflict.
- **Rename** proposes the original name with a number, such as “Company relay (2)”, which can be edited in the row and must not be taken. Routes, aliases and groups in the pack that refer to the item use the new name.
- **Overwrite** replaces the item of that name with the imported one. Routes and aliases on this device that refer to it stay as they are. Overwriting a ChatGPT upstream here, or an OAuth upstream with the same token endpoint, keeps this device's sign-in tokens.
- From a pack without keys, an overwrite keeps this device's key only while the destination stays the same: scheme, host and port, AWS region, OAuth token endpoint, and the outbound proxy it goes through (for a proxy itself, its address). Otherwise the row notes that the address differs from the one here, so the key here is not reused, and the upstream is imported disabled until a key is filled in.
- **Rename** never reuses the key, proxy password or sign-in here: an upstream imported under a new name stays disabled until a key is filled in or it is signed in again, and a plugin imported under a new name is disabled.
- A route, alias or group that refers to a skipped upstream is marked as an error, naming the missing upstream. An upstream imported under a new name does not count as missing.
- When the pack holds no keys, the imported gateway keys are generated anew.
- An import is recorded as a version in the backups, so the configuration from before it can be restored. When the configuration changes after the preview, the import asks for a new preview.

## Turning on sync

Sync lets several devices share one configuration. A device is one Core taking part: the local core, or a remote core on a server. Each device is connected to one sync location at a time. ThinkWatch offers no hosted sync service of its own; the sync location is chosen by the user:

| Type | Storage | Connection settings |
|---|---|---|
| Folder | A folder synced by iCloud Drive, Dropbox, OneDrive, Google Drive, Syncthing and the like, or a NAS share | The folder path |
| WebDAV | Jianguoyun (Nutstore), Nextcloud, Synology NAS, InfiniCloud and others | URL, user name and password (or app password) |
| S3-compatible | Amazon S3, Cloudflare R2, Alibaba Cloud OSS, Tencent Cloud COS, MinIO and others | Endpoint, region, bucket, prefix, access key ID and secret access key |

Requests to WebDAV and S3-compatible storage go out **Direct** (the default), through the **System proxy** or through one of the outbound proxies, as chosen under **Proxy**. For both, plain `http://` is accepted only for this computer and private networks, by the same rules as [import links](/docs/lite/import-links#connection), and only direct, so that a password never crosses a proxy unencrypted; any other address needs `https://`, and its certificate is always verified. Redirects are not followed, so that the sync location's password is never carried to another host; the address entered must be the final one.

While sync is off, the **Sync** part holds only **Turn on sync…** and one line: “Devices share one configuration; the sync location keeps the latest and the previous version.” Turning sync on takes three steps:

1. **Sync location.** Pick the type and fill in the connection settings; **Test connection** checks that the location can be read and written. An empty location leads to step 2 to set up encryption. A location that already holds sync data leads to step 2 for its sync passphrase when it is encrypted, and skips step 2 when it is not.
2. **Encryption.** Starting a new sync, choose **Encrypt with a passphrase** (the default) or **Do not encrypt**, and enter the sync passphrase twice; it has at least 12 characters. Joining an existing sync, enter the passphrase once; the devices already syncing are listed with the time each last synced. A wrong passphrase is reported as “The sync passphrase is not correct.”
3. **Merge.** Only when joining an existing sync from a device that already has a configuration. The items are previewed by the rules of [importing](#importing), and each conflict is resolved with overwrite, rename or skip; alternatively, **Replace this device's configuration with the sync data**.

The default gateway key that every installation creates needs no choice in the merge: the joining device takes the value from the sync data, and clients connected on it are updated automatically.

A device whose configuration is still the initial one, a new installation that has not been changed, skips step 3 and takes the sync data as it is. A new installation offers **Join sync…** on its empty Upstreams page, which opens these steps directly. The configuration from before joining is kept in the backups. The **Device name** starts as the computer's name and can be changed. When two devices turn sync on in the same empty location at the same moment, the one that finishes second is asked to test the connection again and continues by joining.

Once sync is on, the **Sync** part shows the state (such as “Synced · 2 minutes ago”), the sync location with its connection settings, the proxy, encryption, the upstreams not synced and the device name, followed by the devices taking part, each with its name, last sync, Core version and state. **Sync now** checks at once. The sync settings are written to `config.yaml` and take effect when **Save** is chosen. Changing the connection settings is for the same location, such as a new password; moving to another sync location means stopping sync and turning it on again.

### When devices sync

| When | What happens |
|---|---|
| The configuration changes here | Changes made within 10 seconds are combined and uploaded as one new version. Before Core exits it uploads anything not yet uploaded, and what fails to upload goes up at the next start. |
| On a schedule | WebDAV and S3-compatible storage are checked for new versions every 30 minutes; a new version is downloaded, merged and applied. A folder is watched for changes, and a new version is applied as soon as it arrives. |
| On events | Core starting, the device waking from sleep, the network coming back and the main window opening each trigger a check. |
| By hand | **Sync now**. |

Renewing a ChatGPT token, changing local settings and upgrading a built-in plugin upload nothing. With WebDAV or S3-compatible storage, a change made on another device arrives within 30 minutes, or at once when the main window opens; with a folder, it arrives as soon as the folder's own client has carried it over. A version from another device is applied through the usual configuration write, checked and then loaded without a restart, and is recorded as a backup version with **Synced from** and the device's name as its source.

## Setting up each sync location

Every device connects to the same location: the same folder in the same cloud drive, the same WebDAV address, or the same bucket and prefix. The folder, address or prefix entered is itself the root of the sync location: `keyring` (when encrypted), `versions/` and `devices/` are placed directly in it, with no subfolder of their own. A new, empty folder or prefix for ThinkWatch, such as `ThinkWatch`, keeps them apart from other files.

### iCloud Drive, Dropbox, OneDrive and other folders

Choose **Folder** and pick, with **Choose…**, the folder created for ThinkWatch in the cloud drive; pick the same folder on every device. The drive's own client carries the files between devices, and ThinkWatch only reads and writes that folder.

| Drive | Where its folder usually is |
|---|---|
| iCloud Drive | macOS: iCloud Drive in the Finder sidebar, that is `~/Library/Mobile Documents/com~apple~CloudDocs`. Windows: `%USERPROFILE%\iCloudDrive` from iCloud for Windows |
| Dropbox | macOS: `~/Library/CloudStorage/Dropbox`, or `~/Dropbox` for older installations. Windows: `%USERPROFILE%\Dropbox`. Linux: `~/Dropbox` |
| OneDrive | macOS: the folder starting with `OneDrive` in `~/Library/CloudStorage/`. Windows: `%USERPROFILE%\OneDrive` |
| Google Drive | macOS: the folder starting with `GoogleDrive` in `~/Library/CloudStorage/`. Windows: My Drive on the Google Drive volume |
| Syncthing, NAS shares | The same folder, synced or mounted on each device |

When the drive downloads files only on demand, a version uploaded by another device counts as not yet arrived until it is on this device, and is merged once it is. Keeping the folder always on the device, such as with OneDrive's **Always keep on this device**, makes new versions arrive as soon as they are carried over.

ThinkWatch writes each version under a temporary name and renames it when it is complete, so a drive never carries a half-written file. A file that cannot be decrypted or fails its checksum is also treated as not yet arrived, without an error.

### Jianguoyun (Nutstore)

1. Create a folder in Jianguoyun, such as `ThinkWatch`.
2. In the Jianguoyun web app, open the security options of the account settings and add an application under third-party app management; Jianguoyun generates an app password for it.
3. In ThinkWatch Lite, choose **WebDAV**. The URL is `https://dav.jianguoyun.com/dav/ThinkWatch/`, the user name is the Jianguoyun account, and the password is the app password from step 2, not the account password.

### Nextcloud

1. Create a folder in Nextcloud, such as `ThinkWatch`.
2. Create an app password on the Security page of the personal settings. An account with two-factor authentication must use an app password.
3. The URL is `https://<server>/remote.php/dav/files/<user>/ThinkWatch/`, with the Nextcloud user name and the app password from step 2. The Files settings in Nextcloud's Files app also show the WebDAV address.

### Synology NAS

1. Install WebDAV Server from the DSM Package Center and enable HTTPS, on port 5006 by default.
2. Create a subfolder in a shared folder, such as `ThinkWatch`. A DSM account of its own for ThinkWatch, with read and write access to that folder only, is recommended.
3. The URL is `https://<NAS address>:5006/<shared folder>/ThinkWatch/`, with that DSM account's user name and password.

ThinkWatch always verifies the TLS certificate, and the self-signed certificate DSM comes with does not pass. A Let's Encrypt certificate for the NAS's domain can be obtained in DSM under **Control Panel › Security › Certificate**. For use on the local network only, `http://<private IP>:5005/…` works too; the password, and the configuration when it is not encrypted, then cross the local network unencrypted.

### Addressing on S3-compatible storage

The endpoint decides how the bucket is addressed, with nothing to set: when the endpoint's host ends in `amazonaws.com`, `aliyuncs.com` or `myqcloud.com`, that is Amazon S3, Alibaba Cloud OSS and Tencent Cloud COS, the bucket goes in the host name (virtual-hosted style); every other endpoint, such as Cloudflare R2, MinIO or an IP address, puts it in the path (path style). A bucket name uses lowercase letters, digits, dots and hyphens; the prefix is a folder inside the bucket and cannot start with `/` or contain `.` or `..` segments.

### Cloudflare R2

1. Create a bucket in R2 in the Cloudflare dashboard, without public access.
2. Create an API token in R2's API token management, with object read and write permission applied to that bucket only. It gives an access key ID and a secret access key.
3. In ThinkWatch Lite, choose **S3-compatible**:

| Field | Value |
|---|---|
| Endpoint | `https://<account-id>.r2.cloudflarestorage.com`, where `<account-id>` is the Cloudflare account ID; for a bucket in the EU jurisdiction, `https://<account-id>.eu.r2.cloudflarestorage.com` |
| Region | `auto` |
| Bucket | The bucket from step 1 |
| Prefix | Empty, or a path such as `thinkwatch/` to keep it apart from other content in the bucket |
| Access key ID, secret access key | The values from step 2 |

### Alibaba Cloud OSS

| Field | Value |
|---|---|
| Endpoint | The S3-compatible address of OSS, `https://s3.oss-<region-id>.aliyuncs.com`; for China (Hangzhou), `https://s3.oss-cn-hangzhou.aliyuncs.com` |
| Region | The region ID, such as `cn-hangzhou` |
| Bucket | The bucket name |
| Access key ID, secret access key | The AccessKey ID and AccessKey secret of a RAM user |

A RAM user of its own for ThinkWatch, allowed to read and write that bucket only, is recommended, and the bucket's access stays private.

### Tencent Cloud COS

| Field | Value |
|---|---|
| Endpoint | `https://cos.<region>.myqcloud.com`; for Guangzhou, `https://cos.ap-guangzhou.myqcloud.com` |
| Region | The region code, such as `ap-guangzhou` |
| Bucket | The full bucket name with its APPID, in the form `<name>-<APPID>` |
| Access key ID, secret access key | The SecretId and SecretKey of an API key in Cloud Access Management |

The key of a sub-user allowed to read and write that bucket only is recommended, and the bucket's access stays private.

### MinIO

| Field | Value |
|---|---|
| Endpoint | The S3 API address of MinIO, such as `https://minio.example.com:9000`, or `http://192.168.1.20:9000` for use on the local network only. The default port is 9000, not the console's port. MinIO is addressed in path style, so its buckets need no domain names |
| Region | The region set in MinIO, or `us-east-1` when none is set |
| Bucket | A bucket created beforehand |
| Access key ID, secret access key | An access key created for ThinkWatch, with a policy that allows reading and writing that bucket only |

### Other S3-compatible storage

The endpoint is the service's S3 API address, `https://s3.<region>.amazonaws.com` for Amazon S3, and the region is the bucket's region. The bucket should be private, and the key should reach that bucket only.

## Encryption

- Encryption is chosen when sync is turned on, encrypted by default, and every device on one sync location uses the same setting. Each device asks for the sync passphrase once, when it joins. The passphrase and the sync location's credentials are stored in the `sync` section of `config.yaml` on the device, like every other key, and are never exported or synced.
- With encryption, the first device generates a random key, encrypts it with the sync passphrase and stores it in the sync location as `keyring`; every version and device record is encrypted with that key, in the age format. The sync location's provider sees only the file names (the version number and the first 8 characters of a device ID), the file sizes and their modification times. The authenticated encryption also guarantees that a version has not been tampered with: without the passphrase, no one can write a valid version.
- Without encryption, a version is a plain config pack. The provider of the sync location can read the configuration and the keys in it, and anyone who can write to the location can write a version and change the configuration. Choosing **Do not encrypt** when turning sync on shows this warning. To limit what tampering can do, a plugin added or with its script changed by sync starts disabled on this device and is turned on here, and an upstream whose address changed through sync is marked **URL changed by sync** once on its row. An unencrypted version carries a SHA-256 checksum, which only detects damage in transit.
- Turning encryption on later: once a sync passphrase is set, the latest version is uploaded again encrypted and the unencrypted versions are deleted; the other devices ask for the passphrase at their next sync. Turning it off needs the current passphrase and uploads the version again unencrypted; the sync passphrase saved on each device is kept, to check the sync key with.
- An encrypted location never accepts unencrypted versions and never turns encryption off by itself: when the sync key (`keyring`) goes missing or is replaced by an older one, syncing pauses instead; see [Sync states](#sync-states).
- **Change passphrase…** re-encrypts only `keyring` and leaves the versions as they are. The other devices then show “Sync passphrase changed on another device” and continue once the new passphrase is entered.
- If the sync passphrase is lost and no device is still syncing, the contents of the sync location cannot be decrypted; the only way forward is to stop syncing and turn sync on again. The configuration and backups on each device are not affected. Each device keeps its own copy of the sync key, which can put it back when the one in the sync location is lost.

## What is synced

Everything in the configuration is synced, keys included, except local settings, the sign-in tokens of ChatGPT and OAuth upstreams, and data such as request records. The full list is under [Never exported or synced](#never-exported-or-synced).

- **ChatGPT upstreams** appear disabled on a new device, marked **Sign-in required**, and stay off there until they are signed in on that device; this turns them off nowhere else. The sign-in tokens and the account ID that comes with a sign-in stay on each device and are never compared; signing in, renewing and signing out do not trigger a sync. Each device can sign in to a different ChatGPT account.
- **Upstreams that use an OAuth refresh token** are signed in on each device, as ChatGPT upstreams are. The token endpoint, client ID and client secret are synced; the refresh and access tokens stay on each device, and refreshing them triggers no sync. On a device that has no token yet, the upstream stays off until that device's own refresh token is filled in; the other devices are not affected. Many OAuth services issue a new refresh token on every refresh and invalidate the old one, so one token shared by two devices would invalidate itself.
- **Upstreams not synced** are chosen in the sync settings under **Upstreams not synced**, a local setting. They are not uploaded, and an upstream of the same name from another device does not replace them, which suits an Ollama at a local address. Routes, aliases and groups that refer to them are not synced either and are listed in the sync settings after “Not synced with them:”. While sync is on, their rows carry a **Not synced** tag.
- **Plugins** are synced, and each stays turned on or off alike on every device; a plugin that may change tool calls runs only once it is approved on each device. The scripts of the plugins built into Core come from each device's Core and are upgraded with it, so they are not synced; whether they are on and their settings are. Different Core versions on the devices cause no sync because of their built-in plugins.
- **Environment variables** written as `${NAME}` are synced as written. On a device where the variable is not set, requests to that upstream fail there, the upstream row says why, and the rest of the configuration is unaffected.
- **Lite's general preferences**, the language, appearance, menu bar item, notifications and update checks, stay the same on every device, and a change made on another device takes effect at once. When the general preferences in the sync data exceed 64 KiB, this device keeps its own and the rest is synced as usual.

## Conflicts

### How versions merge

Each version records the version it was based on. A merge takes the last version both sides share as its base and compares the configuration on this device with the latest version in the sync location, unit by unit:

| Item | Merge units |
|---|---|
| Upstream | Connection (service, address, protocol, authentication method, key, headers, outbound proxy, AWS settings); models (model list, the models it is limited to, models added by hand, specs); billing (billing mode, prices, price multiplier); other (concurrency limit, client identity forwarding, balance source, disabled state) |
| Proxy, gateway key, alias, group, route, price sheet, custom security rule | The whole item |
| Plugin | Script; settings; on or off |
| Upstream order, route order, plugin order | One unit each |
| Global settings, Lite's general preferences | Each field |

When two devices change different units of the same item, the changes merge by themselves: one device rotates an upstream's key while the other changes its prices, for instance. A conflict arises only when the same unit is changed differently on both sides, or deleted on one side and changed on the other. A rename counts as deleting the old name and adding the new one. A merged result must pass the configuration's checks, such as a route's upstream existing, and an item that fails them is treated as a conflict.

When two devices upload at the same moment, the sync location holds two versions with the same number, and the next device to sync merges them into a new one. Each device keeps the version it last synced as the base for its next merge, so older versions deleted from the sync location while a device was offline do not affect the merge once it is back.

### Resolving conflicts

- A conflict does not stop syncing: everything else is merged and uploaded as usual, and each device keeps its own content for the conflicting items.
- The conflicts travel with the versions, so every device involved shows the same ones. Once they are resolved on any device, the result is uploaded as a new version and the others clear them; nothing is resolved twice.
- The **Sync** part and the top of the Upstreams page show a yellow notice, such as “2 sync conflicts”, whose **Resolve…** opens the **Sync conflicts** dialog. The notice can be ignored; the conflicts remain until they are resolved.
- The dialog lists each item with the time and device of each side's change and the fields that differ; clicking an item's name shows the difference. In the **Use** column, each item takes **This device**, the other device (shown by its name) or **Keep both**: this device's content keeps the name, and the other side's is added as “Name (device name)”, which can be edited. Global settings, the orders, Lite's general preferences and items deleted on one side cannot keep both. **Later** closes the dialog without changes; **Apply** writes the items that have a choice and leaves the rest for later.

## Sync states

| State | Shown | What to do |
|---|---|---|
| Synced | “Synced · 2 minutes ago” in the settings; nothing on other pages | — |
| Syncing | “Syncing” in the settings | — |
| Conflict | A yellow notice such as “2 sync conflicts”; “2 conflicts” in the settings | **Resolve…** |
| Sync location unreachable | After 2 hours of failures in a row, a yellow notice “Sync location unreachable” with the reason | Nothing: syncing resumes by itself, and the changes made here are uploaded then |
| Access denied | A yellow notice “Sync location denied access” | Correct the connection settings |
| Passphrase changed | A yellow notice “Sync passphrase changed on another device” | **Enter passphrase…** with the new one |
| Newer version | A yellow notice “Sync paused”: “Another device uses a newer version. Update ThinkWatch Lite to continue syncing.” The device lists of the other devices show this one as “Paused: update required” | **Check for updates** and update ThinkWatch Lite |
| Sync key unavailable | A yellow notice “Sync key at the sync location unavailable”: the sync key is missing, was replaced by an older one or cannot be read, and syncing is paused | **Upload this device's configuration**, which also puts back the sync key saved on this device, or **Stop syncing…** |
| Sync location empty | A yellow notice “Sync location empty”: another device may have deleted the sync data, or the location is no longer the same place, and syncing is paused. A location that reads as empty is checked a few more times first | **Upload this device's configuration**, or **Stop syncing…** |
| Sync settings unusable | A yellow notice “Sync settings unusable”, such as when the chosen outbound proxy no longer exists | Correct the connection details or the proxy |
| Safe mode | “Paused: safe mode” in the settings | Nothing: syncing continues once the configuration can be read again |

None of these states turns sync off by itself; stopping is always the user's choice. Nothing raises a system notification while sync runs normally. A state that needs attention raises one, following the notice setting in **Settings › General**, and every yellow notice can be ignored. Files at the sync location that cannot be used are skipped, and the state says how many.

When the latest version in the sync location was written by a newer Core that this device cannot read, the device pauses syncing and neither downloads nor uploads. Changes made in the meantime stay on the device and are merged by the usual rules after the update, so an older Core never overwrites fields a newer Core wrote. A remote core is updated on its server; the device list shows each device's Core version.

A device record not updated for 180 days is removed automatically.

## Stopping sync

**Stop syncing…** offers two ways:

- **Stop syncing**: the device keeps its current configuration, drops its sync settings and removes its device record from the sync location. The other devices are not affected.
- **Stop and delete sync data…**, after a further confirmation, deletes every version, every device record and `keyring` from the sync location. It cannot be undone; this device's configuration and local backups are not affected. The other devices then report the location as empty, where each can upload its configuration again or stop syncing.

## Restore

- **Restore…** on a version in the **Backups** list opens a preview of the differences between that version and the current configuration, item by item: added, removed or changed. Every item is checked by default, which replaces the current configuration with the version as a whole; an unchecked item keeps its current content. To bring back one deleted upstream, check only that one.
- An unchecked item that a checked one refers to is restored with it, and an item that would be removed but is still referred to by items that stay is marked “Kept: still referred to by items that stay”. The preview and the write follow the same plan.
- Local settings keep their current values. A ChatGPT upstream of the same name, and an OAuth upstream with the same token endpoint, keep their current sign-in tokens rather than the older ones in the backup, which a refresh may already have invalidated.
- A restore is itself recorded as a new version, so it can be undone.
- While sync is on, the restored configuration is uploaded as a new version and the other devices follow; the foot of the preview says so, for example “The restored config will sync to 2 other devices.” Upstreams not synced are not affected.

### When the configuration cannot be read

When the configuration cannot be read and the app runs in safe mode, the error page offers **Restore from backup…** next to **Repair**. It lists the versions on the device, and those in the sync location when it can be reached, and opens the restore preview for the chosen one. When the configuration cannot be read at all, a restore brings back the whole version, keeping only the current control channel key. An upgrade does not rewrite the configuration and therefore makes no version of its own: a configuration that cannot be read after an upgrade is the latest version, and the content from before a repair is kept in the backups as well.

From 2026.10.25, an upstream address may not contain a backslash or carry a user name or password before the host. A configuration with such an address opens in safe mode after the upgrade; the backups hold the same address, so the fix is to edit the configuration file and move the credential into the key or a header.

## Connected clients

Each client connected on this device has a gateway key written into its configuration file. When a sync, a restore or an import with **Overwrite** changes gateway keys, the following keeps those clients working:

| Situation | What happens |
|---|---|
| The value of a gateway key a client uses is replaced | The configuration of those clients is rewritten, as when a key is rotated on the Keys page |
| A gateway key a client uses would be deleted | Sync: the key is kept and listed as a conflict, noting “A client on this device uses this gateway key; it was not deleted.” Restore: the item is marked “Kept: in use by a client on this device” in the preview and not deleted |
| The default gateway keys differ when joining a sync | The value from the sync data is used, and clients connected on this device are updated automatically |
| **Replace this device's configuration with the sync data** when joining a sync | The keys clients on this device use are added to the sync data and then synced to the other devices; the joining steps say so |

With a remote core, the Lite connected to it does the same when it is told of the change.

## With a remote core

- **Sync and backup** sits under the server's configuration in the settings, and backups, exports, imports and sync all apply to the configuration on the server.
- Exports and imports go through the control channel, and the config pack is saved and opened on the computer running Lite.
- A remote core can join a sync too. The server itself connects to the sync location, and a folder path is a path on the server, typed in by hand; the folder dialog is available only with the local core.
- Lite's general preferences stay on the computer running Lite and are not handed to the remote core: Lite adds them to an export and applies them on import, and they take no part in the remote core's backups or sync.

## Command line

On a server without a desktop, or to restore by hand when the configuration is broken, `twcore` has these commands:

```sh
twcore export -o all.twconfig
twcore export --providers relay --no-secrets --encrypt -o relay.twconfig
twcore import all.twconfig --dry-run
twcore import all.twconfig --on-conflict rename
twcore backup list
twcore backup restore <id> --dry-run
twcore backup restore <id>
twcore sync status
twcore sync now
twcore sync enable
twcore sync republish
twcore sync disable --purge
```

- `export` writes the whole configuration; `--providers` limits it to the comma-separated upstreams, with what they refer to. `--no-secrets` leaves the keys out, and `--encrypt` encrypts the file with a passphrase typed in the terminal, without echo, or taken from the `TWCORE_PASSPHRASE` environment variable. With neither, the file holds keys in plain text.
- `import` adds what is not here and asks about each item that differs; `--on-conflict overwrite|rename|skip` answers for all of them, and `--dry-run` shows what the import would do without writing. An encrypted pack asks for its passphrase or reads `TWCORE_PASSPHRASE` as well, and a pack from an older version lists its repairs first.
- `backup list` lists the versions newest first, with their ids; `backup restore` brings back a whole version, and `--dry-run` lists what would change. A restore keeps the local settings, the ChatGPT sign-ins and the gateway keys that clients on this machine use.
- `export`, `import` and `backup` work on the files in the data directory, so they work while core is not running, including when a broken configuration keeps it from starting; a running core picks their changes up within a second.
- `sync` talks to the running core over the control channel: `status` prints the state, the location and the devices, `now` syncs once, `enable` asks for the sync location and passphrase interactively, `republish` uploads this device's configuration again after the sync location was emptied or lost its keyring (and puts back the keyring this device keeps), and `disable` stops syncing with this device keeping its configuration; `--purge` also deletes every version, device record and `keyring` from the sync location.

On a server set up by the install script, the commands start with `sudo -u thinkwatch THINKWATCH_HOME=/var/lib/thinkwatch`, like those in [Connecting to a remote core](/docs/lite/remote-core). `twcore <command> --help` lists every option.

## Never exported or synced

| Content | Export | Sync | Backup on the device | Notes |
|---|---|---|---|---|
| Upstreams, proxies, aliases, groups, routes, the default route, price sheets, security rules, failover, auxiliary requests | Included | Included | Included | — |
| Plugin scripts and settings | Included | Included | Included | Imported disabled; for sync, see [What is synced](#what-is-synced) |
| Upstream keys, header values, AWS credentials, OAuth client secrets, proxy passwords, gateway keys, keys from a Z.ai / BigModel sign-in | Included by default; can be turned off | Included | Included | `${NAME}` is kept as written, not expanded. When an export leaves keys out, the upstream keys are filled in after importing and the gateway keys are generated anew |
| ChatGPT sign-in tokens; the refresh and access tokens of OAuth upstreams | Not included | Not included | Included | One refresh token used on two devices invalidates itself. The upstream itself is exported and synced, and each device signs in separately |
| Lite's general preferences: language, appearance, menu bar item, notifications, update checks | Included | Included | Included | With the local core, Core keeps them in the data directory |
| Local settings: listening, the control channel key, remote control, sync settings (including the upstreams not synced), log retention | Not included | Not included | Included | A restore keeps their current values |
| Client config locations, which clients are connected | Not included | Not included | Not included | These are paths on the device and the clients' own configuration files; on a new computer, clients are connected again on the Clients page |
| Remote connections | Not included | Not included | Not included | The address depends on the network the device is on; the connection key can be generated again on the server |
| Request records, cost records, session bodies | Not included | Not included | Not included | Data rather than configuration, and possibly gigabytes in size |

## Related

- [Import links](/docs/lite/import-links): links that share a single upstream, and their parameters.
- [Connecting to a remote core](/docs/lite/remote-core): managing ThinkWatch Core on a server from the app.
- [Features](/docs/lite/features): what each page does.
