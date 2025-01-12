declare module "*.module.css" {
  const styles: { [key: string]: string };
  export default styles;
}

type Styles = { [key: string]: string };
