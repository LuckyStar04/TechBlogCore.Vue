import { usePreferredColorScheme } from "@vueuse/core"
import { computed, ref } from "vue"

const preferred = usePreferredColorScheme()

const isDark = ref(false)

export const useDark = computed({
  get() {
    let color = localStorage.getItem("TechBlog_ThemeColor")
    if (!color) {
      isDark.value = preferred.value === 'dark'
      localStorage.setItem("TechBlog_ThemeColor", preferred.value)
      if (isDark.value) {
        document.documentElement.classList.add("dark")
      }
    } else {
      isDark.value = color === 'dark'
    }
    return isDark.value
  },
  set(dark: boolean) {
    let color = dark ? "dark" : "light"
    localStorage.setItem("TechBlog_ThemeColor", color)
    isDark.value = dark
  }
})

const changeTheme = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add("dark")
    document
      .querySelector('meta[name="theme-color"]')!
      .setAttribute("content", "#121212")
  } else {
    document.documentElement.classList.remove("dark")
    document
      .querySelector('meta[name="theme-color"]')!
      .setAttribute("content", "#ffffff")
  }
};

export function handleDark(event: MouseEvent) {
  let isDark = useDark.value
  //在不支持的浏览器里不做动画
  if (!document.startViewTransition) {
    changeTheme(isDark)
    return
  }
  // 开始一次视图过渡：
  const transition = document.startViewTransition(() => changeTheme(isDark))
  transition.ready.then(() => {
    const x = event.clientX
    const y = event.clientY
    //计算按钮到最远点的距离用作裁剪圆形的半径
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    //开始动画
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: "ease-in",
        pseudoElement: isDark
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    )
  })
}
