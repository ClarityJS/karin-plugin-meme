import { helpCfg } from '@/models/help/config'
import { Version } from '@/root'
import { HelpType } from '@/types'

export const getThemeCfg: HelpType['theme']['getThemeCfg'] = () => {
  const resPath = `${Version.Plugin_Path}/resources/help/theme`
  const mainImagePath = `${resPath}/main.webp`
  const bgImagePath = `${resPath}/bg.webp`

  return {
    main: mainImagePath,
    bg: bgImagePath,
    style: helpCfg.style
  }
}

export const getThemeData: HelpType['theme']['getThemeData'] = (diyStyle) => {
  const helpConfig = Object.assign({}, diyStyle)
  const colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount?.toString() ?? '3'), 2))
  const colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth?.toString() ?? '265')))
  const width = Math.min(2500, Math.max(800, colCount * colWidth + 30))
  const theme = getThemeCfg()
  const themeStyle: any = theme.style ?? {}
  const ret = [`
    body { background-image: url(${theme.bg}); width: ${width}px; }
    .container { background-image: url(${theme.main}); width: ${width}px; }
    .help-table .td, .help-table .th { width: ${100 / colCount}%; }
  `]

  const defFnc = function (...args: any[]) {
    let result: any
    args.forEach((arg) => {
      if (arg !== undefined && result === undefined) {
        result = arg
      }
    })
    return result
  }

  const css = function (
    sel: string,
    cssProperty: string,
    key: string,
    def: any,
    fn?: (val: any) => any
  ) {
    let val = defFnc(themeStyle[key], diyStyle?.[key], def)
    if (fn) {
      val = fn(val)
    }
    ret.push(`${sel} { ${cssProperty}: ${val}; }`)
  }

  css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
  css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
  css('.help-desc', 'color', 'descColor', '#eee')
  css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
  css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n: number) =>
    diyStyle?.bgBlur === false ? 'none' : `blur(${n}px)`
  )
  css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
  css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
  css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')

  return {
    style: `<style>${ret.join('\n')}</style>`,
    colCount
  }
}
