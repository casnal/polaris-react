---
name: Sheet
category: Overlays
platforms:
  - web
keywords:
  - sheet
---

# Sheet

A sheet is a large container that enters from the edge of the screen when triggered by the merchant. It’s used to provide merchants with actions and information contextual to the page. It doesn’t interrupt their flow like a modal.

---

## Required components

The sheet component must be wrapped in the [frame](/components/structure/frame) component.

---

## Use in an embedded application

Use of the sheet component in an embedded application is not currently supported. If this is a feature you would like to see supported by Shopify App Bridge, let us know in the [forums](https://ecommerce.shopify.com/c/shopify-apis-and-technology).

---

## Accessibility

Sheets provide an opportunity to let merchants dig into more detail on their current task, or access information for their current task in a different way. Although merchants may be able to see content in the sheet and the main page content at the same time, they should only be expected to interact with one or the other at any given time.

### Keyboard support

- Use the `onClose` prop so that the sheet can be closed with the <kbd>esc</kbd> key as well as with button-based controls
- Use a button to open the sheet
- When the sheet opens, move focus to it so merchants who rely on the keyboard and screen readers can access it
- When the sheet closes, move focus back to the button that launched it

---

## Best practices

The sheet component should:

- Include a heading that summarizes the actions and information in the sheet, for example, More filters
- Be openable through clear actions, like a link or button
- Be close-able through clear actions, like Done, the [X] button, and the esc key
- Include information and actions contextual to the current task
- Not block merchants from completing their task, like a modal would
- Not open from within another sheet (only one sheet can be open at a time)
- Preserve its state—the settings and actions won’t reset when it’s closed

---

## Examples

### Basic sheet

<!-- example-for: web -->

Use as the default option for a sheet.

```jsx
class SheetExample extends React.Component {
  state = {
    sheetActive: false,
    newsletter: false,
    email: '',
  };

  render() {
    const theme = {
      colors: {
        topBar: {
          background: '#357997',
        },
      },
      logo: {
        width: 124,
        topBarSource:
          'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
        contextualSaveBarSource:
          'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
        url: 'http://jadedpixel.com',
        accessibilityLabel: 'Jaded Pixel',
      },
    };

    const {sheetActive, newsletter, email} = this.state;

    return (
      <AppProvider theme={theme}>
        <Frame topBar={<TopBar />}>
          <Page title="Sheet">
            <Card sectioned>
              <Button onClick={this.handleToggleSheet}>
                {sheetActive ? 'Close sheet' : 'Open sheet'}
              </Button>
            </Card>
            <Sheet open={sheetActive} onClose={this.handleCloseSheet}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    borderBottom: '1px solid #DFE3E8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1.6rem',
                    width: '100%',
                  }}
                >
                  <Heading>Sign up</Heading>
                  <Button
                    accessibilityLabel="Cancel"
                    icon="cancel"
                    onClick={this.handleCloseSheet}
                    plain
                  />
                </div>
                <Scrollable style={{padding: '1.6rem', height: '100%'}}>
                  <Form onSubmit={this.handleSubmit}>
                    <FormLayout>
                      <Checkbox
                        label="Sign up for the Polaris newsletter"
                        checked={newsletter}
                        onChange={this.handleChange('newsletter')}
                      />

                      <TextField
                        value={email}
                        onChange={this.handleChange('email')}
                        label="Email"
                        type="email"
                        helpText={
                          <span>
                            We’ll use this email address to inform you on future
                            changes to Polaris.
                          </span>
                        }
                      />

                      <Button submit>Submit</Button>
                    </FormLayout>
                  </Form>
                </Scrollable>
                <div
                  style={{
                    alignItems: 'center',
                    borderBottom: '1px solid #DFE3E8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1.6rem',
                    width: '100%',
                  }}
                />
              </div>
            </Sheet>
          </Page>
        </Frame>
      </AppProvider>
    );
  }

  handleOpenSheet = () => {
    this.setState({sheetActive: true});
  };

  handleCloseSheet = () => {
    this.setState({sheetActive: false});
  };

  handleToggleSheet = () => {
    const {sheetActive} = this.state;

    if (sheetActive) {
      this.handleCloseSheet();
    } else {
      this.handleOpenSheet();
    }
  };

  handleSubmit = (event) => {
    this.setState({newsletter: false, email: ''});
  };

  handleChange = (field) => {
    return (value) => this.setState({[field]: value});
  };
}
```

---

## Related components

- To offer an action before merchants can go to the next step in the flow, use the [modal component](/components/overlays/modal).
- To present a small amount of content or a menu of actions in a non-blocking overlay, use the [popover component](/components/overlays/popover).
