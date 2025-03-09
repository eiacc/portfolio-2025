export type Output = {
  index   : string;
  css     : string;
  js      : string
}

type Files = {
  ext : Extension;
  path: string;
}

export type DevelopmentEnv = {
  index       : string;
  javascript  : Files;
  styles      : Files;
}

export type Dest = {
  pub     ?: string;
  pages   ?: string;
}

export type Extension = "css" | "js"

export type Directory = {
  dev     : DevelopmentEnv;
  output  : Output;
  pub     : string;
  pages   : string;
  dest    : Dest;
}

export type Optimize = (extension: Extension, from: string, destination: string) => Promise<void>;