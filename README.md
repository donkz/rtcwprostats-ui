# prostats web client

## Getting started

1. Clone `https://github.com/rtcwmp-com/rtcwprostats-ui.git`
2. Run `yarn install` in repository folder to install libraries before the first run
3. Run `yarn dev` to start a local development server
4. Develop, test the website on localhost against real API, use Developer Tools in chrome or edge to see API calls
5. `yarn build` will run typescript checks and build for production
6. Resolve all build errors before committing to rtcwpro organization
7. Start a new branch `git checkout -b mycoolchange`
8. `git push origin HEAD` to push this branch to rtcwpro organization
9. Create a pull request and ask a peer to approve it
10. Ask donkz to sync the changes to his fork to deploy to production via `https://github.com/donkz/rtcwprostats-ui.git`
11. Wait 5 minutes to deploy to AWS Amplify

PS: DNS and SSL cert for stats.rtcwpro.com are managed by Nihilist
