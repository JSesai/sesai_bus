import { app } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'


export function getPreloadPath() {

    return path.join(
        app.getAppPath(),
        isDev ? '.' : '..',
        '/dist-electron/preload.cjs'
    )
}