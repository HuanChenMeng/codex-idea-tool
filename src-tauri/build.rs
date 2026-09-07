fn main() {
  // 明确指定 Windows EXE 的资源图标；不要依赖 bundle 阶段的默认图标解析。
  // 这样“窗口图标”和资源管理器里的 .exe 文件图标使用同一份 C-I 图标。
  println!("cargo:rerun-if-changed=icons/icon.ico");
  let icon = std::path::PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap())
    .join("icons")
    .join("icon.ico");
  let windows = tauri_build::WindowsAttributes::new().window_icon_path(icon);
  tauri_build::try_build(tauri_build::Attributes::new().windows_attributes(windows))
    .expect("failed to build Tauri resources");
}
