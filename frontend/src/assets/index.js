const images = import.meta.glob("./*.{png,jpg,jpeg,svg,avif}", { eager: true });

export default Object.keys(images).reduce((acc, path) => {
  const key = path.replace("./", "");
  acc[key] = images[path].default;
  return acc;
}, {});
