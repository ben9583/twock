<p align="center"><img width="911" alt="Twock" src="https://user-images.githubusercontent.com/16968917/205165074-93f58a12-3965-4cc4-b071-b6ac02be6a83.png" /></p>

<p align="center"><i>A tool for viewing Twitter's opinions on stocks</i></p>

# About

Twock is a tool and website that pulls data from Twitter about a stock and displays tweets about it. These can be used by the user for sentiment analysis in their own application.

Twock is currently not being hosted as it is still in development, but will be available for public use at [twock.xyz](https://twock.xyz/).

This project is part of an assignment for CSE412 (Database Management) for the fa22 semester.

## Disclaimer

Twock is a project that fetches tweets from a user-inputted stock ticker symbol, however Twock is not responsible for and does not endorse the content of the tweets. The user is advised that inappropriate tweets may appear as part of their query.

# Development

Thank you for being interested in making Twock better! Below are instructions for getting started on development, building your own instance of Twock, and contributing to the main project.

## Setup

[NodeJS v18+](https://nodejs.org/download/release/latest-v18.x/) is required to build and develop this project as a prerequisite. Please make sure you have a working version and `npm` installed.

You will need to also have an instance of [PostgreSQL](https://www.postgresql.org/) running at `localhost:5432`.

First, clone the project and navigate to the project root directory.
```sh
git clone --recursive https://github.com/harshavb/twock.git twock
cd twock
```

Next, install the required packages for Twock. This project uses the [React](https://reactjs.org/) framework [NextJS](https://nextjs.org/) for development. You are free to use an alternative package manager like `yarn` or `pnpm`, but by default we use `npm`.
```sh
npm i
```

Lastly, you'll want to configure your PostgreSQL database information in the `.env` folder located in the root of the project. By default, it looks like this:
```
USER=UPDATEME           # The postgres user
PGPASSWORD=UPDATEME     # Password for the user
PGDATABASE=twockdb      # Database name
PGPORT=5432             # Database port (default: 5432)
```

You'll want to update the `USER` and `PGPASSWORD` information with your Postgres information before continuing. You can either create a database called `twockdb` at port 5432, or change the environment variables to reflect your setup.

## Building

You can run a webpack development server for live updates while developing using `start`:
```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

When you're ready to build, use the `build` script to get a production-optimized output.
```sh
npm run build
```

## Contributing

If you would like to submit an issue, there isn't a required format, but when in doubt, include as much information you think may be relevant as possible. When reporting a bug, include a description of the issue, the expected behavior, and steps to reproduce the bug; it may also be helpful to include relevant crash logs or console errors if applicable. To request a feature, include a detailed description of what you'd like to see added to Twock. Feature requests are a discussion, so please be available to respond to questions and concerns in the comments.

If you're looking for an issue to resolve, check out the [issues](https://github.com/harshavb/twock/issues) page for problems needing resolution. Feel free to run any ideas in the comments and more experienced developers can give you guidance on how to continue.

When you're ready to submit a pull request, please explain all of the changes you've made as well as any relevant issues the changes address. You may be asked to revise some of your modifications, so please be active in discussion if it arises.

# Resources

To learn more about the tools we use to develop the project, take a look at the following links:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [React Homepage](https://reactjs.org) - learn about web development with React.
- [PostgreSQL](https://postgresql.org) - our backend, relational database.
- [node-postgres Documentation](https://node-postgres.com/) - documentation for our PostgreSQL interface through Node.

## Warranty Information

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
