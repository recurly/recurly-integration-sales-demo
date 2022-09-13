export const hashParams = () => {
  if (location.search.slice(1) == '') return {};
  return location.search.slice(1).split('&').reduce((acc, i) => {
    const [k,v] = i.split('=');
    acc[k] = v;
    return acc;
  }, {});
}