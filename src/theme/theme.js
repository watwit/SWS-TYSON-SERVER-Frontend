import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      success: {
        main: '#4caf50',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor:'#fff',
            '& input:disabled': {
              backgroundColor: '#f7f7f7',
              WebkitTextFillColor: "#344054",
            },
            '& textarea:disabled': {
              backgroundColor: '#f7f7f7',
              WebkitTextFillColor: "#344054",
            },
          },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          sx: {
            fontSize: "18px",
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          sx: {
            fontSize: "18px",
            color:"#000",
          }
        },
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              backgroundColor: '#f7f7f7',
            },
          },
        },
      }
    },
    typography: {
      button: {
        textTransform: "none",
        fontSize: '16px',
      }
    }
  });

export default theme;