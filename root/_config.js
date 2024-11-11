"use strict";

const { join } = require("node:path");

process.env.PUBLIC_DIR = join(__dirname, "public");
