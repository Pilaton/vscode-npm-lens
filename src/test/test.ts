const formatRepoUrl = (repoUrl: string): string => {
  const match = repoUrl.match(/github\.com.*(?=\.git)/);
  return match ? `https://${match[0]}` : "";
};

console.log(
  "fweewfedwqdwqw",
  formatRepoUrl("git+ssh://git@github.com/mongodb/node-mongodb-native.git")
);
