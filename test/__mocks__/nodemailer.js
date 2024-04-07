module.exports = {
  createTransport: () => ({
    sendMail: () => {
      console.log("This function is called to send an email....");
    },
  }),
};
