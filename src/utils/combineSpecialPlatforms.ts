export const combineSpecialPlatforms = (names: string[]) => {
  if (names.length <= 1) return names;

  const hasSwitch1 = names.includes("Nintendo Switch");
  const hasSwitch2 = names.includes("Nintendo Switch 2");

  if (hasSwitch1 && hasSwitch2) {
    return [
      ...names.filter(
        (n) => n !== "Nintendo Switch" && n !== "Nintendo Switch 2",
      ),
      "Nintendo Switch 1+2",
    ];
  }

  return names;
};
