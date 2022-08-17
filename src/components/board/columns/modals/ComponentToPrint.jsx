import * as React from 'react';

export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  render() {
    const { description, user, board, questions } = this.props;

    return (
      <div style={{ margin: '30px', color: 'black', height: '90%' }}>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
          <div>
            <h1>Doctor Name : {user.fullName}</h1>
            <h1>Email : {user.email}</h1>
          </div>
          <div>
            <h2>Patient Name : {board.name}</h2>
            <h2>
              Date : {new Date().getDate()}-{new Date().getMonth()}-{new Date().getFullYear()}
            </h2>
          </div>
        </div>
        <br />
        <hr />
        <br />
        <div style={{ margin: '10px' }}>
          {questions.map((question, index) => (
            <div key={index}>
              <div>
                {question.value} = {question.checked ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          style={{ justifyContent: 'space-between', margin: '10px' }}
        />
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} />;
});
