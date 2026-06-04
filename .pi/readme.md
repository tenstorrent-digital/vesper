# Pi

Shared configuration for [pi](https://github.com/earendil-works/pi/tree/main/packages/coding-agent)

## Settings

Team settings are available in [`.pi/settings.json`](https://github.com/tenstorrent-digital/tenstorrent/blob/main/.pi/settings.json).

Here we set the default provider and model that will be set when Pi opens in this repository.

The default **provider** is currently configured to be Github Copilot, with access provided through Tenstorrent IT[^1].

The default **model** is arbitrary, but must be set in order to start Pi using our default provider (We can update the model here whenever we like).

### Provider Setup

> [!NOTE]
> To use Github Copilot as a provider, you must have access to Github Copilot[^1].

Run `/login` from inside Pi, then select Github Copilot, and login with your Github account[^2].

If your Github Copilot subscription is provided by Tenstorrent, you will be prompted to authenticate with SSO.

If you don't have access to Github Copilot, or you have not authenticated with Github with `/login`, pi will fallback to your global settings.

> [!IMPORTANT]
> In order for Pi to use our default model, the model will need to be in your scoped models.
>
> If you've edited your [scoped models](https://github.com/earendil-works/pi/tree/main/packages/coding-agent#:~:text=Enable/disable%20models%20for%20Ctrl+P%20cycling), you'll need to add the default model set in `[.pi/settings.json](https://github.com/tenstorrent-digital/tenstorrent/tree/main/.pi/settings.json)` to your scoped models with `/scoped-models`.

[^1]: Request Github Copilot access from IT here: [Tenstorrent IT Service Management](https://tenstorrent.atlassian.net/servicedesk/customer/portal/95/group/114)
[^2]: Pi Providers (Login + Auth) documentation: `[providers.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md#subscriptions)`

## Skills

Agent skills are managed for all agents with the `agent:skills:*` commands in [ package.json](https://github.com/tenstorrent-digital/tenstorrent/blob/main/package.json). Adding a skill with `agent:skills:add` will automatically setup the skill for use in Pi.
