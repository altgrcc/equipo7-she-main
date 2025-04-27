module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier', // hace que Prettier y ESLint no choquen
    ],
    plugins: ['react', '@typescript-eslint', 'import'],
    rules: {
        'react/react-in-jsx-scope': 'off', // No es necesario con React 17+
        '@typescript-eslint/no-unused-vars': ['warn'],
        'import/order': ['warn', { 'newlines-between': 'always' }],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
