# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0 (2021-08-12)

### Added

-   Support for scene notes following the same paradigm as the Journal Links.

### Fixed

-   Now properly checks if _header element_ exists or not.
-   No longer displaying a ui notification when a _header_ is not found. Instead logs a warning in console for easier debugging.

## 1.0.2 (2021-08-10)

### Fixed

-   CSS rule on body to fix it on screen. This allows the use of `scrollIntoView()` again.
-   Reverted to `scrollIntoView()` setting behaviour to smooth.
-   Setting a custom name for a link will now be respected by the module.

## 1.0.1 (2021-08-09)

### Added

-   Animation to scroll

### Fixed

-   Bug where canvas would be scrolled as well

## 1.0.0 (2021-08-09)

> Initial Commit and Release

### Added

-   Libary
-   Module files
