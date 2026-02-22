# Start the development server
run:
    npm start

# Compile TypeScript
compile:
    npm run compile

# Compile and run development server
iterate: compile
    npm start

# Build webpack bundles
build:
    npm run build -- --no-stats

# Build development bundle
build-dev:
    npm run build-dev

# Run all tests (requires prior build)
test-all:
    env DATABASE_CLIENT=sqlite npm test

# Build project then run tests
test: build
    env DATABASE_CLIENT=sqlite npm test
