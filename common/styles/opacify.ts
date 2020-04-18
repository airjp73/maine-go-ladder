interface OpacifiableColor {
  rgb: {
    r: number;
    g: number;
    b: number;
  };
}

function opacify({ rgb: { r, g, b } }: OpacifiableColor, amount: number) {
  return `rgba(${r}, ${g}, ${b}, ${amount})`;
}

export default opacify;
