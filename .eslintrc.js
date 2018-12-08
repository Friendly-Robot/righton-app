module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "settings": {
    "import/parser": "babel-eslint",
  },
  "rules": {
    "strict": 0,
    "react/jsx-filename-extension": 0,
    "import/first": 0,
    "jsx-a11y/href-no-hash": 0,
    "no-use-before-define": 0,
    "react/prefer-stateless-function": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "skipBlankLines": true,
    "react/prop-types": [<enabled/>, { ignore: <ignore/>, customValidators: <customValidator/> }]
  }
};
