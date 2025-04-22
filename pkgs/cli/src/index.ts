import tmpl from 'chalk-template';

export const createLogger = (name:string) => {
    return {
        tmpl,
        log (...msg:string[]) { console.log(tmpl`[ {green DayZ} ] ${msg.join(' ')}`); },
        error (...msg:string[]) { console.log(tmpl`[ {yellow DayZ} ] ${msg.join(' ')}`); }
    }
}