let staticStyle = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
    },
    header: {
        flex: '0 0 50px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    title: {
        flex: '1',
        width: '100%',
        height: '100%'
    },
    buttons: {
        flex: '0 0 100px',
        height: '100%'
    }
}

let getStyleWith = ({values}) => Object.assign({}, staticStyle,
    {
        templateStyle: {
            border: `green solid ${values || 0 }px`
        }
    }
)

export default getStyleWith
