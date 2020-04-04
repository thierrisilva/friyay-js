const reactSelectCustomTheme = theme => ({
  ...theme,
  borderRadius: 5,
  colors: {
    ...theme.colors,
    primary: '#A2A2A2',
    primary75: '#BBBBBB',
    primary50: '#CCCCCC',
    primary25: '#FAFAFA'
  }
});

export default reactSelectCustomTheme;
