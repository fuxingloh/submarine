import { app, shell } from 'electron'
import Wallet from '../controllers/wallets'

export default class ApplicationMenu {
  getTemplate() {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'Wallet',
        submenu: [
          {
            label: 'Import Wallet',
            click(item, bw) {
              const wallet = new Wallet()
              wallet.load(bw)
            },
          },
          {
            label: 'Backup Wallet',
            click(item, bw) {
              const wallet = new Wallet()
              wallet.backup(bw)
            },
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Visit our site',
            click: async () => {
              await shell.openExternal('https://cakedefi.com')
            },
          },
        ],
      },
    ]

    if (process.platform === 'darwin') {
      const label = app.name
      const submenu: Electron.MenuItemConstructorOptions[] = [
        {
          label: `About ${label}`,
          role: 'about',
          accelerator: 'CmdOrCtrl+Z',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${label}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          },
        },
      ]

      template.unshift({
        label,
        submenu,
      })

      this.addUpdateMenuItems(template[0].submenu, 1)
    }

    if (process.platform === 'win32' || process.platform === 'linux') {
      const helpMenu = template[template.length - 1].submenu
      this.addUpdateMenuItems(helpMenu, 0)
    }

    return template
  }

  addUpdateMenuItems(items: any, position: any) {
    if (process.mas) return

    const version = app.getVersion()
    const updateItems = [
      {
        label: `Version ${version}`,
        enabled: false,
      },
    ]
    if (items) items.splice.apply(items, [position, 0].concat(updateItems))
  }
}
