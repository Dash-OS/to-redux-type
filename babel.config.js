module.exports = function getBabelConfiguration(api) {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          shippedProposals: true,
          targets: {
            browsers: 'last 2 versions',
          },
        },
      ],
      process.env.NODE_ENV === 'production' ? 'babel-preset-minify' : undefined,
    ].filter(Boolean),
  };
};
