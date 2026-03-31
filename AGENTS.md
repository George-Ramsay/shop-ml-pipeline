# Agent Instructions and Principles

## Objective
Build a working end-to-end ML web app quickly, with a strong bias toward visible progress and simple architecture.

## Core Priorities
1. Get the website working locally first.
2. Connect the app to Supabase.
3. Connect the app to the ML pipeline.
4. Keep the project submission-ready at every stage.

## Working Principles
- Prefer the simplest working solution.
- Prioritize end-to-end functionality over perfect architecture.
- Do not overengineer.
- Keep app logic, data logic, and ML logic clearly separated.
- Make progress in small, testable increments.
- Ensure every major feature is demoable before moving on.
- Use mock data first when it speeds up UI development.
- Replace mocks with real Supabase data as soon as the UI is stable.
- Reuse preprocessing between training and inference.
- Avoid hardcoded local-only paths in deployed code.
- Keep environment variables and secrets out of source code.
- Write code that is easy to review, explain, and demo.

## Testing Requirements
- Test every page after it is built.
- Test every DB read/write after Supabase integration.
- Verify new order creation end to end.
- Verify the scoring workflow refreshes the queue.
- Use lightweight automated tests where helpful, but do not let testing block progress.

## Deployment Principles
- Keep Vercel deployment simple.
- Configure Supabase environment variables correctly.
- Make sure the deployed app does not depend on local files.
- Validate the live URL before considering a phase complete.

## Definition of Good Work
- The feature works.
- The feature is understandable.
- The feature can be demoed.
- The feature fits the assignment requirements.