export default (user) => {
  return user?.first_name?.[0] + user?.last_name?.[0];
};
