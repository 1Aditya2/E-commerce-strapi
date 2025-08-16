module.exports = ({ env }) => ({
 
    upload: {
      config: {
        // Comment out Cloudinary for now - use local upload
        // provider: 'cloudinary',
        // providerOptions: {
        //   cloud_name: env('CLOUDINARY_NAME'),
        //   api_key: env('CLOUDINARY_KEY'),
        //   api_secret: env('CLOUDINARY_SECRET'),
        // },
        // actionOptions: {
        //   upload: {},
        //   delete: {},
        // },
      },
    },

  });