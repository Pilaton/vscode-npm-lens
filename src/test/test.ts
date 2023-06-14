const CONFIG = {
  url: "https://bundlephobia.com/api/size?package=",
  exceptions: ["^@types/", "^webpack-cli$", "^next$"],
  errorText: "«Bundlephobia»: failed to get dependency size: ",
};
const regex = new RegExp(CONFIG.exceptions.join("|"));
console.log("regex:", regex);

console.log(regex.test("next"));
