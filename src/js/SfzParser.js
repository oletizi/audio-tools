// Generated from ./Sfz.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import SfzListener from './SfzListener.js';
const serializedATN = [4,1,9,65,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,1,0,5,0,16,8,0,10,0,12,0,19,9,0,1,0,1,0,1,1,5,1,24,8,1,10,
1,12,1,27,9,1,1,1,1,1,5,1,31,8,1,10,1,12,1,34,9,1,1,1,1,1,4,1,38,8,1,11,
1,12,1,39,1,1,5,1,43,8,1,10,1,12,1,46,9,1,1,2,1,2,1,2,1,2,1,3,3,3,53,8,3,
1,4,1,4,1,4,1,4,1,5,3,5,60,8,5,1,6,3,6,63,8,6,1,6,0,0,7,0,2,4,6,8,10,12,
0,1,1,0,5,6,66,0,17,1,0,0,0,2,25,1,0,0,0,4,47,1,0,0,0,6,52,1,0,0,0,8,54,
1,0,0,0,10,59,1,0,0,0,12,62,1,0,0,0,14,16,3,2,1,0,15,14,1,0,0,0,16,19,1,
0,0,0,17,15,1,0,0,0,17,18,1,0,0,0,18,20,1,0,0,0,19,17,1,0,0,0,20,21,5,0,
0,1,21,1,1,0,0,0,22,24,7,0,0,0,23,22,1,0,0,0,24,27,1,0,0,0,25,23,1,0,0,0,
25,26,1,0,0,0,26,28,1,0,0,0,27,25,1,0,0,0,28,44,3,4,2,0,29,31,7,0,0,0,30,
29,1,0,0,0,31,34,1,0,0,0,32,30,1,0,0,0,32,33,1,0,0,0,33,35,1,0,0,0,34,32,
1,0,0,0,35,43,3,4,2,0,36,38,7,0,0,0,37,36,1,0,0,0,38,39,1,0,0,0,39,37,1,
0,0,0,39,40,1,0,0,0,40,41,1,0,0,0,41,43,3,8,4,0,42,32,1,0,0,0,42,37,1,0,
0,0,43,46,1,0,0,0,44,42,1,0,0,0,44,45,1,0,0,0,45,3,1,0,0,0,46,44,1,0,0,0,
47,48,5,1,0,0,48,49,3,6,3,0,49,50,5,2,0,0,50,5,1,0,0,0,51,53,5,4,0,0,52,
51,1,0,0,0,52,53,1,0,0,0,53,7,1,0,0,0,54,55,3,10,5,0,55,56,5,3,0,0,56,57,
3,12,6,0,57,9,1,0,0,0,58,60,5,4,0,0,59,58,1,0,0,0,59,60,1,0,0,0,60,11,1,
0,0,0,61,63,5,4,0,0,62,61,1,0,0,0,62,63,1,0,0,0,63,13,1,0,0,0,9,17,25,32,
39,42,44,52,59,62];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class SfzParser extends antlr4.Parser {

    static grammarFileName = "Sfz.g4";
    static literalNames = [ null, "'<'", "'>'", "'='" ];
    static symbolicNames = [ null, null, null, null, "STRING", "NEWLINE", 
                             "WHITESPACE", "BLOCK_COMMENT", "LINE_COMMENT", 
                             "HASH_COMMENT" ];
    static ruleNames = [ "sfz", "sfzObject", "headerObject", "header", "opcodeStatement", 
                         "opcode", "value" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = SfzParser.ruleNames;
        this.literalNames = SfzParser.literalNames;
        this.symbolicNames = SfzParser.symbolicNames;
    }



	sfz() {
	    let localctx = new SfzContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, SfzParser.RULE_sfz);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 17;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while((((_la) & ~0x1f) === 0 && ((1 << _la) & 98) !== 0)) {
	            this.state = 14;
	            this.sfzObject();
	            this.state = 19;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	        this.state = 20;
	        this.match(SfzParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	sfzObject() {
	    let localctx = new SfzObjectContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, SfzParser.RULE_sfzObject);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 25;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===5 || _la===6) {
	            this.state = 22;
	            _la = this._input.LA(1);
	            if(!(_la===5 || _la===6)) {
	            this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 27;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }

	        this.state = 28;
	        this.headerObject();
	        this.state = 44;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,5,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 42;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
	                switch(la_) {
	                case 1:
	                    this.state = 32;
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                    while(_la===5 || _la===6) {
	                        this.state = 29;
	                        _la = this._input.LA(1);
	                        if(!(_la===5 || _la===6)) {
	                        this._errHandler.recoverInline(this);
	                        }
	                        else {
	                        	this._errHandler.reportMatch(this);
	                            this.consume();
	                        }
	                        this.state = 34;
	                        this._errHandler.sync(this);
	                        _la = this._input.LA(1);
	                    }
	                    this.state = 35;
	                    this.headerObject();
	                    break;

	                case 2:
	                    this.state = 37; 
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                    do {
	                        this.state = 36;
	                        _la = this._input.LA(1);
	                        if(!(_la===5 || _la===6)) {
	                        this._errHandler.recoverInline(this);
	                        }
	                        else {
	                        	this._errHandler.reportMatch(this);
	                            this.consume();
	                        }
	                        this.state = 39; 
	                        this._errHandler.sync(this);
	                        _la = this._input.LA(1);
	                    } while(_la===5 || _la===6);
	                    this.state = 41;
	                    this.opcodeStatement();
	                    break;

	                } 
	            }
	            this.state = 46;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,5,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	headerObject() {
	    let localctx = new HeaderObjectContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, SfzParser.RULE_headerObject);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 47;
	        this.match(SfzParser.T__0);
	        this.state = 48;
	        this.header();
	        this.state = 49;
	        this.match(SfzParser.T__1);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	header() {
	    let localctx = new HeaderContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, SfzParser.RULE_header);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 52;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===4) {
	            this.state = 51;
	            this.match(SfzParser.STRING);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	opcodeStatement() {
	    let localctx = new OpcodeStatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, SfzParser.RULE_opcodeStatement);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 54;
	        this.opcode();
	        this.state = 55;
	        this.match(SfzParser.T__2);
	        this.state = 56;
	        this.value();
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	opcode() {
	    let localctx = new OpcodeContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, SfzParser.RULE_opcode);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 59;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===4) {
	            this.state = 58;
	            this.match(SfzParser.STRING);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	value() {
	    let localctx = new ValueContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, SfzParser.RULE_value);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 62;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===4) {
	            this.state = 61;
	            this.match(SfzParser.STRING);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

SfzParser.EOF = antlr4.Token.EOF;
SfzParser.T__0 = 1;
SfzParser.T__1 = 2;
SfzParser.T__2 = 3;
SfzParser.STRING = 4;
SfzParser.NEWLINE = 5;
SfzParser.WHITESPACE = 6;
SfzParser.BLOCK_COMMENT = 7;
SfzParser.LINE_COMMENT = 8;
SfzParser.HASH_COMMENT = 9;

SfzParser.RULE_sfz = 0;
SfzParser.RULE_sfzObject = 1;
SfzParser.RULE_headerObject = 2;
SfzParser.RULE_header = 3;
SfzParser.RULE_opcodeStatement = 4;
SfzParser.RULE_opcode = 5;
SfzParser.RULE_value = 6;

class SfzContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_sfz;
    }

	EOF() {
	    return this.getToken(SfzParser.EOF, 0);
	};

	sfzObject = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(SfzObjectContext);
	    } else {
	        return this.getTypedRuleContext(SfzObjectContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterSfz(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitSfz(this);
		}
	}


}



class SfzObjectContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_sfzObject;
    }

	headerObject = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(HeaderObjectContext);
	    } else {
	        return this.getTypedRuleContext(HeaderObjectContext,i);
	    }
	};

	WHITESPACE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SfzParser.WHITESPACE);
	    } else {
	        return this.getToken(SfzParser.WHITESPACE, i);
	    }
	};


	NEWLINE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(SfzParser.NEWLINE);
	    } else {
	        return this.getToken(SfzParser.NEWLINE, i);
	    }
	};


	opcodeStatement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(OpcodeStatementContext);
	    } else {
	        return this.getTypedRuleContext(OpcodeStatementContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterSfzObject(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitSfzObject(this);
		}
	}


}



class HeaderObjectContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_headerObject;
    }

	header() {
	    return this.getTypedRuleContext(HeaderContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterHeaderObject(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitHeaderObject(this);
		}
	}


}



class HeaderContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_header;
    }

	STRING() {
	    return this.getToken(SfzParser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterHeader(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitHeader(this);
		}
	}


}



class OpcodeStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_opcodeStatement;
    }

	opcode() {
	    return this.getTypedRuleContext(OpcodeContext,0);
	};

	value() {
	    return this.getTypedRuleContext(ValueContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterOpcodeStatement(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitOpcodeStatement(this);
		}
	}


}



class OpcodeContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_opcode;
    }

	STRING() {
	    return this.getToken(SfzParser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterOpcode(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitOpcode(this);
		}
	}


}



class ValueContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = SfzParser.RULE_value;
    }

	STRING() {
	    return this.getToken(SfzParser.STRING, 0);
	};

	enterRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.enterValue(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof SfzListener ) {
	        listener.exitValue(this);
		}
	}


}




SfzParser.SfzContext = SfzContext; 
SfzParser.SfzObjectContext = SfzObjectContext; 
SfzParser.HeaderObjectContext = HeaderObjectContext; 
SfzParser.HeaderContext = HeaderContext; 
SfzParser.OpcodeStatementContext = OpcodeStatementContext; 
SfzParser.OpcodeContext = OpcodeContext; 
SfzParser.ValueContext = ValueContext; 
