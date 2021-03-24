import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let board = [];
        for (let y = 0; y < 3; y++) {
            let row = [];
            for (let x = 0; x < 3; x++) {
                row.push(this.renderSquare(3 * x + y));
            }
            board.push(<div className="board-row">{row}</div>);
        };
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                selected: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            reverseMoves: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                selected: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleReverseMovesChange() {
        this.setState({
            reverseMoves: !this.state.reverseMoves,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const x = Math.floor(step.selected / 3) + 1;
            const y = step.selected % 3 + 1;
            const mark = (move % 2) === 0 ? 'O' : 'X';
            const desc = move ?
                ('Go to move #' + move + ': ' + mark + ' to (' + x + ', ' + y + ')') :
                'Go to game start';
            let formattedDesc;
            if (this.state.stepNumber === move) {
                formattedDesc = <b>{desc}</b>;
            } else {
                formattedDesc = desc;
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{formattedDesc}</button>
                </li>
            );
        });

        const reverseMoves = this.state.reverseMoves;
        if (reverseMoves) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winnder: ' + winner;
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol reversed={reverseMoves}>{moves}</ol>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.state.reverseMoves}
                            onChange={() => this.handleReverseMovesChange()}
                        />
                        reverse move order
                    </label>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}