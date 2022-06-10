/**
 *
 * @param {string} input
 * @param {string[]} commands
 */
export const isInputContainsCommand = (input, commands) => {
  return commands.reduce((result, command) => {
    const isCommandValid = input.slice(command.length).match(/\s/);
    if (input.startsWith(command) && isCommandValid) {
      result = true;
    }
    return result;
  }, false);
};

/**
 *
 * @param {string} inputCommand
 */
export const getCommandArguments = (inputCommand) => {
  return inputCommand.split(/\s/).slice(1);
};
