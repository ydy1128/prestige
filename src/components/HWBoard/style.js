let staticStyle = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: '30px',
    },
    header: {
        flex: '0 0 66px',
        padding: '0px 10px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    title: {
        padding: '0px 10px',
        flex: '1',
        width: '100%',
        height: '100%'
    },
    buttons: {
        flex: '0 0 100px',
        height: '100%'
    },
    body: {
        padding: '0px 10px',
        flex: '1',
        position: 'relative',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'reverse-column',
    },
    button: {
        fontSize: '35px',
        padding: '14px',
        marginRight: '10px',
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
