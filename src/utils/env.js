
const LOC = {
  TOPMENUNO: '000000',
};

const SIT = {
  TOPMENUNO: '000001',
};

console.log('环境变量', UMI_ENV);
export default function getEnvVariables(vari) {
  switch (UMI_ENV) {
    case 'loc':
      return LOC[vari];
    case 'sit':
      return SIT[vari];
    default:
      return LOC[vari];
  }
}
