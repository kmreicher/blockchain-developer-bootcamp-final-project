## The contracts apply the following measures to avoid common security pitfalls

### SWC-100 Proper setting of visibility for functions
Functions can be specified as being `external`, `public`, `internal` or `private`. It is recommended to make a conscious decision on which visibility type is appropriate for a function. This can dramatically reduce the attack surface of a contract system.

### SWC-103 Floating pragma
Specific compiler `pragma 0.8.11` used in contracts to avoid accidental bug inclusion through outdated compiler versions.

### SWC-115 `tx.origin auth`
The Election contract uses `msg.sender`.

### Use Modifiers Only for Validation
The modifiers are used only for validation. They do not change state.

### Recommended Use of Require
The require, revert and assert are used in a proper way. Require is being used for input validation.
